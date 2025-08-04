"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Edit, Trash2, Calendar, AlertCircle } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface Task {
  id: string
  title: string
  description: string
  priority: "low" | "medium" | "high"
  dueDate: string
  completed: boolean
  createdAt: string
}

interface TaskItemProps {
  task: Task
  onToggle: (taskId: string, completed: boolean) => void
  onEdit: (task: Task) => void
  onDelete: (taskId: string) => void
}

export function TaskItem({ task, onToggle, onEdit, onDelete }: TaskItemProps) {
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      const response = await fetch(`/api/tasks/${task.id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        onDelete(task.id)
      }
    } catch (error) {
      console.error("Failed to delete task:", error)
    } finally {
      setIsDeleting(false)
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 border-red-200"
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "low":
        return "bg-green-100 text-green-800 border-green-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const isOverdue = new Date(task.dueDate) < new Date() && !task.completed
  const isDueSoon = new Date(task.dueDate) <= new Date(Date.now() + 24 * 60 * 60 * 1000) && !task.completed

  return (
    <Card className={`transition-all duration-200 hover:shadow-md ${task.completed ? "opacity-75" : ""}`}>
      <CardContent className="p-4">
        <div className="flex items-start space-x-4">
          <Checkbox
            checked={task.completed}
            onCheckedChange={(checked) => onToggle(task.id, checked as boolean)}
            className="mt-1"
          />

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className={`font-medium text-gray-900 ${task.completed ? "line-through text-gray-500" : ""}`}>
                  {task.title}
                </h3>
                {task.description && (
                  <p className={`mt-1 text-sm text-gray-600 ${task.completed ? "line-through" : ""}`}>
                    {task.description}
                  </p>
                )}
              </div>

              <div className="flex items-center space-x-2 ml-4">
                <Button variant="ghost" size="sm" onClick={() => onEdit(task)} disabled={isDeleting}>
                  <Edit className="h-4 w-4" />
                </Button>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="ghost" size="sm" disabled={isDeleting}>
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Task</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete "{task.title}"? This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>

            <div className="flex items-center space-x-3 mt-3">
              <Badge variant="outline" className={getPriorityColor(task.priority)}>
                {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
              </Badge>

              {task.dueDate && (
                <div
                  className={`flex items-center text-sm ${
                    isOverdue ? "text-red-600" : isDueSoon ? "text-orange-600" : "text-gray-500"
                  }`}
                >
                  {isOverdue && <AlertCircle className="h-4 w-4 mr-1" />}
                  <Calendar className="h-4 w-4 mr-1" />
                  {new Date(task.dueDate).toLocaleDateString()}
                  {isOverdue && <span className="ml-1 font-medium">(Overdue)</span>}
                  {isDueSoon && !isOverdue && <span className="ml-1 font-medium">(Due Soon)</span>}
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
