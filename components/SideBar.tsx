"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"
import { ChevronLeft, ChevronRight } from "lucide-react"
import * as ScrollArea from "@radix-ui/react-scroll-area"
import { FileText, LogOut } from "lucide-react"

import { SideBarMenuItem } from "@/components/SideBarMenuItem"

interface MenuProps {
  title: string
  icon: React.ReactNode
  link?: string
  isGroup?: boolean
  children?: MenuProps[]
}

interface SideBarProps {
  menu: MenuProps[],
  openSideBar:any,
  setOpenSideBar:any
}

export function SideBar({ menu,openSideBar,setOpenSideBar }: SideBarProps) {

  const [activeTitle, setActiveTitle] = useState(menu[0]?.title || "")
  const pathname = usePathname()
  const iconSize = 20
  const constraintWindowWidth = 800

  const handleMenuClick = (menuTitle: string) => {
    setActiveTitle(menuTitle)
  }

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < constraintWindowWidth) {
        setOpenSideBar(false)
      } else {
        setOpenSideBar(true)
      }
    }

    handleResize()
    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  useEffect(() => {
    const currentPath = pathname
    const findActiveMenu:any = (menuItems: MenuProps[]) => {
      for (const item of menuItems) {
        if (item.link && currentPath.startsWith(item.link)) {
          return item.title
        }
        if (item.isGroup && item.children) {
          const activeChild = findActiveMenu(item.children)
          if (activeChild) return activeChild
        }
      }
      return ""
    }
    const activeMenuTitle = findActiveMenu(menu)
    if (activeMenuTitle) {
      setActiveTitle(activeMenuTitle)
    }
  }, [pathname, menu])

  return (
    <div
      className={`${openSideBar ? "w-60" : "w-16"} bg-background min-h-screen p-3 pt-5 duration-300 border-r border-foreground/10 relative`}
    >
      <div
        className="absolute cursor-pointer -right-3 top-12 w-6 h-6 flex items-center justify-center bg-background border border-foreground/10 rounded-full"
        onClick={() => setOpenSideBar(!openSideBar)}
      >
        {openSideBar ? (
          <ChevronLeft className="h-4 w-4 text-[#cccccc]" />
        ) : (
          <ChevronRight className="h-4 w-4 text-[#cccccc]" />
        )}
      </div>

      <div className="flex gap-x-3 items-center mb-6">
        <FileText className={`text-primary h-8 w-8 duration-300 ${openSideBar && "mr-2"}`} />
        <h1 className={`text-[#cccccc] font-medium text-lg duration-200 ${!openSideBar && "scale-0 w-0"}`}>InterviewTrack</h1>
      </div>

      <ScrollArea.Root className="overflow-hidden">
        <ScrollArea.Viewport className="py-2 max-h-[calc(100vh-150px)]">
          <ul className="space-y-1">
            {menu.map((menuItem, index) => (
              <SideBarMenuItem
                key={index}
                menu={menuItem}
                open={openSideBar}
                activeTitle={activeTitle}
                handleMenuClick={handleMenuClick}
              />
            ))}
          </ul>
          <div
            className={`flex rounded-md p-2 cursor-pointer hover:bg-[#37373d] text-[#cccccc] text-sm items-center gap-x-4 mt-6
              ${!openSideBar && "justify-center"}`}
          >
            <LogOut size={iconSize} />
            <span className={`${!openSideBar && "hidden"} origin-left duration-200`}>Logout</span>
          </div>
        </ScrollArea.Viewport>
        <ScrollArea.Scrollbar
          orientation="vertical"
          className="flex w-2.5 touch-none select-none p-[1px] bg-transparent transition-colors"
        >
          <ScrollArea.Thumb className="relative flex-1 rounded-full bg-[#5a5a5a]" />
        </ScrollArea.Scrollbar>
      </ScrollArea.Root>
    </div>
  )
}

