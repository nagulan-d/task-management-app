import { redirect } from "next/navigation"
import { verifySession } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default async function HomePage() {
  const session = await verifySession()

  if (session) {
    redirect("/dashboard")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8 text-center">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">TaskFlow</h1>
          <p className="text-lg text-gray-600 mb-8">Organize your tasks, boost your productivity</p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8 space-y-6">
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-gray-800">Get Started</h2>
            <p className="text-gray-600">Sign up or log in to start managing your tasks efficiently</p>
          </div>

          <div className="space-y-3">
            <Button asChild className="w-full" size="lg">
              <Link href="/signup">Create Account</Link>
            </Button>
            <Button asChild variant="outline" className="w-full bg-transparent" size="lg">
              <Link href="/login">Sign In</Link>
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-12">
          <div className="text-center">
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <h3 className="font-semibold text-gray-800">Create Tasks</h3>
              <p className="text-sm text-gray-600 mt-1">Add and organize your tasks</p>
            </div>
          </div>
          <div className="text-center">
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <h3 className="font-semibold text-gray-800">Set Priorities</h3>
              <p className="text-sm text-gray-600 mt-1">Mark important tasks</p>
            </div>
          </div>
          <div className="text-center">
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <h3 className="font-semibold text-gray-800">Track Progress</h3>
              <p className="text-sm text-gray-600 mt-1">Monitor completion status</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
