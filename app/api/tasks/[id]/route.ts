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

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await verifySession()
  const { id } = await params

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { title, description, priority, dueDate } = await request.json()

    const taskIndex = tasks.findIndex((task) => task.id === id && task.userId === session.userId)

    if (taskIndex === -1) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 })
    }

    tasks[taskIndex] = {
      ...tasks[taskIndex],
      title: title || tasks[taskIndex].title,
      description: description !== undefined ? description : tasks[taskIndex].description,
      priority: priority || tasks[taskIndex].priority,
      dueDate: dueDate !== undefined ? dueDate : tasks[taskIndex].dueDate,
    }

    return NextResponse.json(tasks[taskIndex])
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await verifySession()
  const { id } = await params

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { completed } = await request.json()

    const taskIndex = tasks.findIndex((task) => task.id === id && task.userId === session.userId)

    if (taskIndex === -1) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 })
    }

    tasks[taskIndex].completed = completed

    return NextResponse.json(tasks[taskIndex])
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await verifySession()
  const { id } = await params

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const taskIndex = tasks.findIndex((task) => task.id === id && task.userId === session.userId)

  if (taskIndex === -1) {
    return NextResponse.json({ error: "Task not found" }, { status: 404 })
  }

  tasks.splice(taskIndex, 1)

  return NextResponse.json({ message: "Task deleted successfully" })
}
