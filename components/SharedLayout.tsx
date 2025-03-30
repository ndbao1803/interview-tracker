"use client"

import AuthButton from "@/components/AuthButton"

export default function SharedLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex-1 w-full flex flex-col gap-20 items-center bg-[#011627] h-full justify-between">
      <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
        <div className="w-full flex justify-end items-center p-3 text-sm">
          <AuthButton />
        </div>
      </nav>

      <div className="w-full h-full">
        {children}
      </div>

      <footer className="w-full border-t border-t-foreground/10 p-8 flex justify-center text-center text-xs">
        <p>
          Powered by{" "}
          <a
            href="https://supabase.com/?utm_source=create-next-app&utm_medium=template&utm_term=nextjs"
            target="_blank"
            className="font-bold hover:underline"
            rel="noreferrer"
          >
            Supabase
          </a>
        </p>
      </footer>
    </div>
  )
} 