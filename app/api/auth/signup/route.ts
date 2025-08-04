import { type NextRequest, NextResponse } from "next/server"
import { createSession } from "@/lib/auth"

// In a real app, you'd use a proper database
const users: Array<{ id: string; name: string; email: string; password: string }> = []

export async function POST(request: NextRequest) {
  try {
    const { name, email, password } = await request.json()

    // Validate input
    if (!name || !email || !password) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 })
    }

    if (password.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 })
    }

    // Check if user already exists
    const existingUser = users.find((user) => user.email === email)
    if (existingUser) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 })
    }

    // Create new user (in a real app, hash the password)
    const newUser = {
      id: Date.now().toString(),
      name,
      email,
      password, // In production, use bcrypt to hash this
    }
    users.push(newUser)

    // Create session
    await createSession(newUser.id)

    return NextResponse.json({ message: "User created successfully", userId: newUser.id }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
