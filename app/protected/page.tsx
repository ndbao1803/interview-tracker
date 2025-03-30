import AccountSettings from "@/components/AccountSettings"
import SharedLayout from "@/components/SharedLayout"

export default async function ProtectedPage() {
  return (
    <SharedLayout>
      <div className="w-full">
        <div className="py-6 font-bold bg-purple-950 text-center">
          This is a protected page that you can only see as an authenticated
          user
        </div>
      </div>

      <div className="animate-in flex-1 flex flex-col gap-20 max-w-4xl px-3">
        <main className="flex-1 flex flex-col gap-6">
          <AccountSettings />
        </main>
      </div>
    </SharedLayout>
  )
}
