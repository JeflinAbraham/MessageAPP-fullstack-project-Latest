"use client"

// code-snippet from nextAuth->Getting started->login page
import { useSession, signIn, signOut } from "next-auth/react"

export default function Component() {
  const { data: session } = useSession()
  if (session) {
    return (
      <div>
        Signed in as {session.user.email} <br />
        <button onClick={() => signOut()}>Sign out</button>
      </div>
    )
  }
  return (
    <div>
      Not signed in <br />
      <button className="bg-blue-600 p-2 rounded-lg m-2" onClick={() => signIn()}>Sign in</button>
    </div>
  )
}