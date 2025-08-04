"use client"

import { TaskItem } from "./task-item"
import { Loader2 } from "lucide-react"

interface Task {
  id: string
  title: string
  description: string
  priority: "low" | "medium" | "high"
  dueDate: string
  completed: boolean
  createdAt: string
}

interface TaskListProps {
  tasks: Task[]
  isLoading: boolean
  onTaskToggle: (taskId: string, completed: boolean) => void
  onTaskEdit: (task: Task) => void
  onTaskDelete: (taskId: string) => void
}

export function TaskList({ tasks, isLoading, onTaskToggle, onTaskEdit, onTaskDelete }: TaskListProps) {
  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-8 text-center">
        <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-gray-400" />
        <p className="text-gray-500">Loading tasks...</p>
      </div>
    )
  }

  if (tasks.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-8 text-center">
        <div className="text-gray-400 mb-4">
          <svg className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No tasks yet</h3>
        <p className="text-gray-500">Create your first task to get started!</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {tasks.map((task) => (
        <TaskItem key={task.id} task={task} onToggle={onTaskToggle} onEdit={onTaskEdit} onDelete={onTaskDelete} />
      ))}
    </div>
  )
}
