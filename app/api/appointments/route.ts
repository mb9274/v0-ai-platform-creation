// import { createClient } from "@/lib/supabase/server"

// Once database tables are created, uncomment the Supabase code below

export async function GET() {
  // To enable database: uncomment the code below and comment out the return statement

  console.log("[v0] Using fallback appointments data (database tables not yet created)")
  return Response.json([])

  /* Uncomment this code once database tables are created:
  
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from("appointments")
      .select("*, clinics(*)")
      .order("appointment_date", { ascending: true })

    if (error) {
      console.log("[v0] Database table not found, returning empty appointments")
      return Response.json([])
    }

    return Response.json(data || [])
  } catch (error) {
    console.log("[v0] Error fetching appointments, returning empty array:", error)
    return Response.json([])
  }
  */
}

export async function POST(request: Request) {
  // To enable database: uncomment the code below and comment out the return statement

  try {
    const body = await request.json()

    console.log("[v0] Simulating appointment creation (database tables not yet created)")
    return Response.json({
      id: Math.random().toString(36).substring(7),
      ...body,
      status: "pending",
      created_at: new Date().toISOString(),
      message: "Appointment request received successfully!",
    })
  } catch (error) {
    return Response.json({ error: "Failed to process appointment request" }, { status: 400 })
  }

  /* Uncomment this code once database tables are created:
  
  try {
    const body = await request.json()
    const supabase = await createClient()

    const { data, error } = await supabase
      .from("appointments")
      .insert([
        {
          patient_name: body.patient_name,
          patient_phone: body.patient_phone,
          patient_email: body.patient_email,
          clinic_id: body.clinic_id,
          doctor_name: body.doctor_name,
          appointment_date: body.appointment_date,
          appointment_time: body.appointment_time,
          reason: body.reason,
          status: "pending",
        },
      ])
      .select()
      .single()

    if (error) {
      console.log("[v0] Database error:", error.message)
      return Response.json(
        { error: "Failed to create appointment" },
        { status: 500 }
      )
    }

    return Response.json(data)
  } catch (error) {
    console.log("[v0] Error creating appointment:", error)
    return Response.json(
      { error: "Failed to process appointment request" },
      { status: 500 }
    )
  }
  */
}
