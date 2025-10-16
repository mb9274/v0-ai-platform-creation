"use client"

interface SyncData {
  id: string
  type: "consultation" | "communication" | "user_update"
  data: any
  timestamp: number
  synced: boolean
}

class OfflineSyncManager {
  private dbName = "healthconnect-offline"
  private version = 1
  private db: IDBDatabase | null = null

  async init() {
    return new Promise<void>((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version)

      request.onerror = () => reject(request.error)
      request.onsuccess = () => {
        this.db = request.result
        resolve()
      }

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result

        // Create object stores
        if (!db.objectStoreNames.contains("sync_queue")) {
          const syncStore = db.createObjectStore("sync_queue", { keyPath: "id" })
          syncStore.createIndex("type", "type", { unique: false })
          syncStore.createIndex("synced", "synced", { unique: false })
        }

        if (!db.objectStoreNames.contains("cached_data")) {
          const cacheStore = db.createObjectStore("cached_data", { keyPath: "key" })
          cacheStore.createIndex("type", "type", { unique: false })
          cacheStore.createIndex("timestamp", "timestamp", { unique: false })
        }

        if (!db.objectStoreNames.contains("health_content")) {
          const contentStore = db.createObjectStore("health_content", { keyPath: "id" })
          contentStore.createIndex("category", "category", { unique: false })
          contentStore.createIndex("language", "language", { unique: false })
        }
      }
    })
  }

  // Add data to sync queue for when connection is restored
  async addToSyncQueue(type: SyncData["type"], data: any): Promise<string> {
    if (!this.db) await this.init()

    const id = `${type}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    const syncItem: SyncData = {
      id,
      type,
      data,
      timestamp: Date.now(),
      synced: false,
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(["sync_queue"], "readwrite")
      const store = transaction.objectStore("sync_queue")
      const request = store.add(syncItem)

      request.onsuccess = () => resolve(id)
      request.onerror = () => reject(request.error)
    })
  }

  // Get unsynced items
  async getUnsyncedItems(): Promise<SyncData[]> {
    if (!this.db) await this.init()

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(["sync_queue"], "readonly")
      const store = transaction.objectStore("sync_queue")
      const index = store.index("synced")
      const request = index.getAll(false)

      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(request.error)
    })
  }

  // Mark item as synced
  async markAsSynced(id: string): Promise<void> {
    if (!this.db) await this.init()

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(["sync_queue"], "readwrite")
      const store = transaction.objectStore("sync_queue")
      const getRequest = store.get(id)

      getRequest.onsuccess = () => {
        const item = getRequest.result
        if (item) {
          item.synced = true
          const updateRequest = store.put(item)
          updateRequest.onsuccess = () => resolve()
          updateRequest.onerror = () => reject(updateRequest.error)
        } else {
          resolve()
        }
      }
      getRequest.onerror = () => reject(getRequest.error)
    })
  }

  // Cache data for offline access
  async cacheData(key: string, type: string, data: any): Promise<void> {
    if (!this.db) await this.init()

    const cacheItem = {
      key,
      type,
      data,
      timestamp: Date.now(),
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(["cached_data"], "readwrite")
      const store = transaction.objectStore("cached_data")
      const request = store.put(cacheItem)

      request.onsuccess = () => resolve()
      request.onerror = () => reject(request.error)
    })
  }

  // Get cached data
  async getCachedData(key: string): Promise<any> {
    if (!this.db) await this.init()

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(["cached_data"], "readonly")
      const store = transaction.objectStore("cached_data")
      const request = store.get(key)

      request.onsuccess = () => {
        const result = request.result
        resolve(result ? result.data : null)
      }
      request.onerror = () => reject(request.error)
    })
  }

  // Cache health content for offline access
  async cacheHealthContent(content: any[]): Promise<void> {
    if (!this.db) await this.init()

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(["health_content"], "readwrite")
      const store = transaction.objectStore("health_content")

      let completed = 0
      const total = content.length

      if (total === 0) {
        resolve()
        return
      }

      content.forEach((item) => {
        const request = store.put(item)
        request.onsuccess = () => {
          completed++
          if (completed === total) resolve()
        }
        request.onerror = () => reject(request.error)
      })
    })
  }

  // Get cached health content
  async getCachedHealthContent(category?: string, language?: string): Promise<any[]> {
    if (!this.db) await this.init()

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(["health_content"], "readonly")
      const store = transaction.objectStore("health_content")

      let request: IDBRequest

      if (category) {
        const index = store.index("category")
        request = index.getAll(category)
      } else if (language) {
        const index = store.index("language")
        request = index.getAll(language)
      } else {
        request = store.getAll()
      }

      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(request.error)
    })
  }

  // Sync all pending data when online
  async syncAll(): Promise<void> {
    if (!navigator.onLine) {
      console.log("Device is offline, skipping sync")
      return
    }

    try {
      const unsyncedItems = await this.getUnsyncedItems()
      console.log(`Syncing ${unsyncedItems.length} items`)

      for (const item of unsyncedItems) {
        try {
          await this.syncItem(item)
          await this.markAsSynced(item.id)
          console.log(`Synced item: ${item.id}`)
        } catch (error) {
          console.error(`Failed to sync item ${item.id}:`, error)
        }
      }
    } catch (error) {
      console.error("Sync failed:", error)
    }
  }

  private async syncItem(item: SyncData): Promise<void> {
    const baseUrl = "/api"

    switch (item.type) {
      case "consultation":
        await fetch(`${baseUrl}/consultations`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(item.data),
        })
        break

      case "communication":
        await fetch(`${baseUrl}/communications`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(item.data),
        })
        break

      case "user_update":
        await fetch(`${baseUrl}/users/${item.data.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(item.data),
        })
        break
    }
  }
}

export const syncManager = new OfflineSyncManager()

// Auto-sync when connection is restored
if (typeof window !== "undefined") {
  window.addEventListener("online", () => {
    console.log("Connection restored, starting sync...")
    syncManager.syncAll()
  })

  // Initialize sync manager
  syncManager.init().catch(console.error)
}
