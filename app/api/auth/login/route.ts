import { type NextRequest, NextResponse } from "next/server"
import { createSession } from "@/lib/auth"

// In a real app, you'd use a proper database
const users: Array<{ id: string; name: string; email: string; password: string }> = [
  { id: "1", name: "Demo User", email: "demo@example.com", password: "password123" },
]

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    // Validate input
    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    // Find user
    const user = users.find((u) => u.email === email && u.password === password)
    if (!user) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    // Create session
    await createSession(user.id)

    return NextResponse.json({ message: "Login successful", userId: user.id }, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
