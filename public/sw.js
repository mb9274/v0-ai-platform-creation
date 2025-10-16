const CACHE_NAME = "healthconnect-v2"
const OFFLINE_URL = "/offline"

// Essential files to cache for offline functionality
const urlsToCache = [
  "/",
  "/offline",
  "/manifest.json",
  "/icon-192x192.png",
  "/icon-512x512.png",
  // Add critical CSS and JS files
  "/_next/static/css/app/layout.css",
  "/_next/static/chunks/webpack.js",
  "/_next/static/chunks/main.js",
]

// Health education audio files to cache
const HEALTH_AUDIO_FILES = [
  "/audio/malaria-prevention-en.mp3",
  "/audio/malaria-prevention-kri.mp3",
  "/audio/child-health-en.mp3",
  "/audio/maternal-health-en.mp3",
  "/audio/mental-health-en.mp3",
  "/audio/emergency-instructions-en.mp3",
]

// Install event - cache essential resources
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => {
        console.log("Caching essential files")
        return cache.addAll(urlsToCache)
      })
      .then(() => {
        // Cache health audio files separately (non-blocking)
        return caches.open(`${CACHE_NAME}-audio`).then((audioCache) => {
          return Promise.allSettled(
            HEALTH_AUDIO_FILES.map((url) =>
              audioCache.add(url).catch((err) => console.log(`Failed to cache ${url}:`, err)),
            ),
          )
        })
      }),
  )
  self.skipWaiting()
})

// Activate event - clean up old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME && cacheName !== `${CACHE_NAME}-audio`) {
            console.log("Deleting old cache:", cacheName)
            return caches.delete(cacheName)
          }
        }),
      )
    }),
  )
  self.clients.claim()
})

// Fetch event - serve from cache when offline
self.addEventListener("fetch", (event) => {
  // Skip non-GET requests
  if (event.request.method !== "GET") {
    return
  }

  // Handle API requests
  if (event.request.url.includes("/api/")) {
    event.respondWith(handleApiRequest(event.request))
    return
  }

  // Handle audio files
  if (event.request.url.includes("/audio/")) {
    event.respondWith(handleAudioRequest(event.request))
    return
  }

  // Handle navigation requests
  if (event.request.mode === "navigate") {
    event.respondWith(handleNavigationRequest(event.request))
    return
  }

  // Handle other requests
  event.respondWith(
    caches
      .match(event.request)
      .then((response) => {
        if (response) {
          return response
        }

        return fetch(event.request).then((response) => {
          // Don't cache non-successful responses
          if (!response || response.status !== 200 || response.type !== "basic") {
            return response
          }

          // Clone the response
          const responseToCache = response.clone()

          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache)
          })

          return response
        })
      })
      .catch(() => {
        // Return offline page for navigation requests
        if (event.request.mode === "navigate") {
          return caches.match(OFFLINE_URL)
        }
      }),
  )
})

// Handle API requests with offline fallback
async function handleApiRequest(request) {
  try {
    const response = await fetch(request)

    // Cache successful GET responses
    if (request.method === "GET" && response.ok) {
      const cache = await caches.open(`${CACHE_NAME}-api`)
      cache.put(request, response.clone())
    }

    return response
  } catch (error) {
    // Try to serve from cache for GET requests
    if (request.method === "GET") {
      const cachedResponse = await caches.match(request)
      if (cachedResponse) {
        return cachedResponse
      }
    }

    // Return offline response for failed API calls
    return new Response(
      JSON.stringify({
        error: "Offline",
        message: "This request will be processed when connection is restored",
      }),
      {
        status: 503,
        headers: { "Content-Type": "application/json" },
      },
    )
  }
}

// Handle audio file requests
async function handleAudioRequest(request) {
  try {
    // Check audio cache first
    const audioCache = await caches.open(`${CACHE_NAME}-audio`)
    const cachedAudio = await audioCache.match(request)

    if (cachedAudio) {
      return cachedAudio
    }

    // Try to fetch and cache
    const response = await fetch(request)
    if (response.ok) {
      audioCache.put(request, response.clone())
    }
    return response
  } catch (error) {
    // Return cached version if available
    const audioCache = await caches.open(`${CACHE_NAME}-audio`)
    const cachedAudio = await audioCache.match(request)

    if (cachedAudio) {
      return cachedAudio
    }

    // Return error response
    return new Response("Audio file not available offline", { status: 404 })
  }
}

// Handle navigation requests
async function handleNavigationRequest(request) {
  try {
    const response = await fetch(request)
    return response
  } catch (error) {
    // Return cached page or offline page
    const cachedResponse = await caches.match(request)
    if (cachedResponse) {
      return cachedResponse
    }

    return caches.match(OFFLINE_URL)
  }
}

// Background sync for offline actions
self.addEventListener("sync", (event) => {
  console.log("Background sync triggered:", event.tag)

  if (event.tag === "consultation-sync") {
    event.waitUntil(syncConsultations())
  } else if (event.tag === "communication-sync") {
    event.waitUntil(syncCommunications())
  } else if (event.tag === "emergency-sync") {
    event.waitUntil(syncEmergencyData())
  }
})

async function syncConsultations() {
  try {
    console.log("Syncing offline consultations...")

    // This would integrate with the IndexedDB sync manager
    // For now, just log the sync attempt
    const response = await fetch("/api/sync/consultations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "sync_offline_data" }),
    })

    if (response.ok) {
      console.log("Consultations synced successfully")
    }
  } catch (error) {
    console.error("Failed to sync consultations:", error)
  }
}

async function syncCommunications() {
  try {
    console.log("Syncing offline communications...")
    // Implementation would sync SMS, voice recordings, etc.
  } catch (error) {
    console.error("Failed to sync communications:", error)
  }
}

async function syncEmergencyData() {
  try {
    console.log("Syncing emergency data...")
    // High priority sync for emergency requests
  } catch (error) {
    console.error("Failed to sync emergency data:", error)
  }
}

// Push notifications for health reminders and updates
self.addEventListener("push", (event) => {
  const options = {
    body: event.data ? event.data.text() : "Health reminder from HealthConnect",
    icon: "/icon-192x192.png",
    badge: "/icon-192x192.png",
    vibrate: [200, 100, 200, 100, 200],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: Math.random(),
    },
    actions: [
      {
        action: "view",
        title: "View Details",
        icon: "/icon-192x192.png",
      },
      {
        action: "dismiss",
        title: "Dismiss",
        icon: "/icon-192x192.png",
      },
    ],
    requireInteraction: true,
  }

  event.waitUntil(self.registration.showNotification("HealthConnect", options))
})

// Handle notification clicks
self.addEventListener("notificationclick", (event) => {
  event.notification.close()

  if (event.action === "view") {
    event.waitUntil(clients.openWindow("/"))
  } else if (event.action === "dismiss") {
    // Just close the notification
    return
  } else {
    // Default action - open the app
    event.waitUntil(clients.openWindow("/"))
  }
})

// Periodic background sync for health reminders
self.addEventListener("periodicsync", (event) => {
  if (event.tag === "health-reminders") {
    event.waitUntil(sendHealthReminders())
  }
})

async function sendHealthReminders() {
  try {
    // Check for scheduled health reminders
    const response = await fetch("/api/reminders/check")
    const reminders = await response.json()

    for (const reminder of reminders) {
      await self.registration.showNotification("Health Reminder", {
        body: reminder.message,
        icon: "/icon-192x192.png",
        tag: `reminder-${reminder.id}`,
      })
    }
  } catch (error) {
    console.error("Failed to send health reminders:", error)
  }
}
