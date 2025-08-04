"use client"

import { useState, useEffect } from "react"
import { TaskList } from "./task-list"
import { TaskForm } from "./task-form"
import { TaskFilters } from "./task-filters"
import { DashboardHeader } from "./dashboard-header"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

interface Task {
  id: string
  title: string
  description: string
  priority: "low" | "medium" | "high"
  dueDate: string
  completed: boolean
  createdAt: string
}

interface TaskDashboardProps {
  userId: string
}

export function TaskDashboard({ userId }: TaskDashboardProps) {
  const [tasks, setTasks] = useState<Task[]>([])
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)

  useEffect(() => {
    fetchTasks()
  }, [])

  useEffect(() => {
    setFilteredTasks(tasks)
  }, [tasks])

  const fetchTasks = async () => {
    try {
      const response = await fetch("/api/tasks")
      if (response.ok) {
        const data = await response.json()
        setTasks(data)
      }
    } catch (error) {
      console.error("Failed to fetch tasks:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleTaskCreated = (newTask: Task) => {
    setTasks((prev) => [newTask, ...prev])
    setIsDialogOpen(false)
  }

  const handleTaskUpdated = (updatedTask: Task) => {
    setTasks((prev) => prev.map((task) => (task.id === updatedTask.id ? updatedTask : task)))
    setEditingTask(null)
    setIsDialogOpen(false)
  }

  const handleTaskDeleted = (taskId: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== taskId))
  }

  const handleTaskToggle = async (taskId: string, completed: boolean) => {
    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed }),
      })

      if (response.ok) {
        const updatedTask = await response.json()
        setTasks((prev) => prev.map((task) => (task.id === taskId ? updatedTask : task)))
      }
    } catch (error) {
      console.error("Failed to update task:", error)
    }
  }

  const handleEdit = (task: Task) => {
    setEditingTask(task)
    setIsDialogOpen(true)
  }

  const handleFilter = (filterType: string, value: string) => {
    let filtered = [...tasks]

    if (filterType === "status") {
      if (value === "completed") {
        filtered = tasks.filter((task) => task.completed)
      } else if (value === "pending") {
        filtered = tasks.filter((task) => !task.completed)
      }
    } else if (filterType === "priority") {
      if (value !== "all") {
        filtered = tasks.filter((task) => task.priority === value)
      }
    } else if (filterType === "sort") {
      if (value === "dueDate") {
        filtered.sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
      } else if (value === "priority") {
        const priorityOrder = { high: 3, medium: 2, low: 1 }
        filtered.sort((a, b) => priorityOrder[b.priority] - priorityOrder[a.priority])
      } else if (value === "created") {
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      }
    }

    setFilteredTasks(filtered)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-80">
            <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Tasks</h2>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button size="sm" onClick={() => setEditingTask(null)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Task
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>{editingTask ? "Edit Task" : "Create New Task"}</DialogTitle>
                    </DialogHeader>
                    <TaskForm task={editingTask} onTaskCreated={handleTaskCreated} onTaskUpdated={handleTaskUpdated} />
                  </DialogContent>
                </Dialog>
              </div>

              <TaskFilters onFilter={handleFilter} />

              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>Total Tasks:</span>
                  <span className="font-medium">{tasks.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Completed:</span>
                  <span className="font-medium text-green-600">{tasks.filter((t) => t.completed).length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Pending:</span>
                  <span className="font-medium text-orange-600">{tasks.filter((t) => !t.completed).length}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <TaskList
              tasks={filteredTasks}
              isLoading={isLoading}
              onTaskToggle={handleTaskToggle}
              onTaskEdit={handleEdit}
              onTaskDelete={handleTaskDeleted}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
