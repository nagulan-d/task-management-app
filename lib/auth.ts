import { cookies } from "next/headers"

export async function createSession(userId: string) {
  const cookieStore = await cookies()

  // In a real app, you'd create a proper JWT token
  const sessionData = JSON.stringify({ userId, createdAt: Date.now() })

  cookieStore.set("session", sessionData, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 1 week
  })
}

export async function verifySession() {
  const cookieStore = await cookies()
  const session = cookieStore.get("session")

  if (!session) {
    return null
  }

  try {
    const sessionData = JSON.parse(session.value)

    // Check if session is expired (7 days)
    if (Date.now() - sessionData.createdAt > 7 * 24 * 60 * 60 * 1000) {
      return null
    }

    return { userId: sessionData.userId }
  } catch {
    return null
  }
}
