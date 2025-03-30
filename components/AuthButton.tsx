"use client"

import { createClient } from "@/utils/supabase/client"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "./ui/button"
import { useEffect, useState } from "react"

export default function AuthButton() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const supabase = createClient()

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    }
    getUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [supabase.auth])

  const signOut = async () => {
    await supabase.auth.signOut()
    router.push("/login")
  }

  return user ? (
    <div className="flex items-center gap-4 ">
      Hey, {user.email}!
      <Button variant="outline" onClick={signOut}>
        Logout
      </Button>
    </div>
  ) : (
    <Button variant="outline">
      <Link
        href="/login"
        className="py-2 px-3 flex rounded-md no-underline bg-btn-background hover:bg-btn-background-hover"
      >
        Login
      </Link>
    </Button>
  )
}
