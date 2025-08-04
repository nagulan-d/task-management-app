import { redirect } from "next/navigation"
import { verifySession } from "@/lib/auth"
import { TaskDashboard } from "@/components/dashboard/task-dashboard"

export default async function DashboardPage() {
  const session = await verifySession()

  if (!session) {
    redirect("/login")
  }

  return <TaskDashboard userId={session.userId} />
}
