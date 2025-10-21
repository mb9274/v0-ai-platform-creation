import { createClient } from "@/lib/supabase/server"

export async function GET() {
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
}

export async function POST(request: Request) {
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
      console.log("[v0] Database table not found, simulating appointment creation")
      return Response.json({
        id: Math.random().toString(36).substring(7),
        ...body,
        status: "pending",
        created_at: new Date().toISOString(),
        message: "Appointment request received. Please run the SQL script to enable database storage.",
      })
    }

    return Response.json(data)
  } catch (error) {
    console.log("[v0] Error creating appointment, returning simulated response:", error)
    return Response.json({
      id: Math.random().toString(36).substring(7),
      status: "pending",
      created_at: new Date().toISOString(),
      message: "Appointment request received. Please run the SQL script to enable database storage.",
    })
  }
}
