"use client"

import AuthButton from "@/components/AuthButton"
import { SideBar } from "@/components/SideBar"
import {
  LayoutDashboard,
  FileImage,
  Briefcase,
  Calendar,
  BarChart,
  Bell,
  FileCheck,
  Settings,
  Search,
  User,
} from "lucide-react"
import { usePathname } from 'next/navigation'

const iconSize = 20
const dashboardMenu = [
  {
    title: "Dashboard",
    icon: <LayoutDashboard size={iconSize} />,
    link: "/dashboard",
  },
  {
    title: "Upload Screenshot", 
    icon: <FileImage size={iconSize} />,
    link: "/dashboard/upload",
  },
  {
    title: "Companies",
    icon: <Briefcase size={iconSize} />,
    link: "/dashboard/companies",
  },
  {
    title: "Interview Process",
    icon: <Calendar size={iconSize} />,
    isGroup: true,
    children: [
      {
        title: "Upcoming",
        icon: <Calendar size={iconSize} />,
        link: "/dashboard/interviews/upcoming",
      },
      {
        title: "Completed",
        icon: <Calendar size={iconSize} />,
        link: "/dashboard/interviews/completed",
      },
      {
        title: "Rejected",
        icon: <Calendar size={iconSize} />,
        link: "/dashboard/interviews/rejected",
      },
    ],
  },
  {
    title: "Application Flow",
    icon: <BarChart size={iconSize} />,
    link: "/dashboard/flow",
  },
  {
    title: "Notifications",
    icon: <Bell size={iconSize} />,
    link: "/dashboard/notifications",
  },
  {
    title: "Reports",
    icon: <FileCheck size={iconSize} />,
    link: "/dashboard/reports",
  },
  {
    title: "Settings",
    icon: <Settings size={iconSize} />,
    link: "/dashboard/settings",
  },
]

export default function SharedLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const excludePaths = ['/', '/login', '/signup']
  const showSidebar = !excludePaths.includes(pathname || '')

  return (
    <div className="flex-1 w-full flex flex-col items-center bg-[#011627] min-h-screen">
      <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16 fixed top-0 z-50 bg-[#011627]">
        <div className="w-full flex justify-end items-center p-3 text-sm ">
          <AuthButton />
        </div>
      </nav>

      <div className="w-full flex mt-16 min-h-[calc(100vh-8rem-1px)]">
        {showSidebar && (
          <div className="fixed left-0 h-[calc(100vh-4rem)] ">
            <SideBar menu={dashboardMenu} />
          </div>
        )}
        <div className={`flex-1 ${showSidebar ? 'ml-[240px]' : ''}`}>
          {children}
        </div>
      </div>

      <footer className="w-full border-t border-t-foreground/10 p-8 flex justify-center text-center text-xs h-16">
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