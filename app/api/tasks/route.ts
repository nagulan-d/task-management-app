import { type NextRequest, NextResponse } from "next/server"
import { verifySession } from "@/lib/auth"

// In-memory storage for demo (use a real database in production)
const tasks: Array<{
  id: string
  userId: string
  title: string
  description: string
  priority: "low" | "medium" | "high"
  dueDate: string
  completed: boolean
  createdAt: string
}> = []

export async function GET() {
  const session = await verifySession()

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const userTasks = tasks.filter((task) => task.userId === session.userId)
  return NextResponse.json(userTasks)
}

export async function POST(request: NextRequest) {
  const session = await verifySession()

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { title, description, priority, dueDate } = await request.json()

    if (!title) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 })
    }

    const newTask = {
      id: Date.now().toString(),
      userId: session.userId,
      title,
      description: description || "",
      priority: priority || "medium",
      dueDate: dueDate || "",
      completed: false,
      createdAt: new Date().toISOString(),
    }

    tasks.push(newTask)

    return NextResponse.json(newTask, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
