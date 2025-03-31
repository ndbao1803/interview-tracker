"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { ChevronRight } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface MenuProps {
  title: string
  icon: React.ReactNode
  link?: string
  isGroup?: boolean
  children?: MenuProps[]
}

interface SideBarMenuItemProps {
  menu: MenuProps
  open: boolean
  activeTitle: string
  handleMenuClick: (title: string) => void
}

export function SideBarMenuItem({ menu, open, activeTitle, handleMenuClick }: SideBarMenuItemProps) {
  const [isOpen, setIsOpen] = useState(false)
  const toggleOpen = () => setIsOpen(!isOpen)

  if (menu.isGroup && menu.children) {
    return (
      <li>
        <motion.div
          className={`flex rounded-md p-2 cursor-pointer hover:bg-primary/5 text-sm items-center gap-x-4
            ${activeTitle === menu.title ? "bg-primary text-white" : "text-[#cccccc]"}
            ${!open && "justify-center"}`}
          onClick={toggleOpen}
          whileTap={{ scale: 0.97 }}
        >
          {menu.icon}
          {open && (
            <>
              <span className="flex-1">{menu.title}</span>
              <motion.div initial={false} animate={{ rotate: isOpen ? 90 : 0 }} transition={{ duration: 0.2 }}>
                <ChevronRight size={16} />
              </motion.div>
            </>
          )}
        </motion.div>
        <AnimatePresence initial={false}>
          {isOpen && open && (
            <motion.ul
              initial="collapsed"
              animate="open"
              exit="collapsed"
              variants={{
                open: { opacity: 1, height: "auto" },
                collapsed: { opacity: 0, height: 0 },
              }}
              transition={{ duration: 0.2, ease: [0.04, 0.62, 0.23, 0.98] }}
              className="pl-4 overflow-hidden"
            >
              {menu.children.map((childMenu, childIndex) => (
                <SideBarMenuItem
                  key={childIndex}
                  menu={childMenu}
                  open={open}
                  activeTitle={activeTitle}
                  handleMenuClick={handleMenuClick}
                />
              ))}
            </motion.ul>
          )}
        </AnimatePresence>
      </li>
    )
  }

  return (
    <li>
      <Link href={menu.link || "#"}>
        <div
          className={`flex rounded-md p-2 cursor-pointer hover:bg-primary/5 text-sm items-center gap-x-4
            ${activeTitle === menu.title ? "bg-primary text-white" : "text-[#cccccc]"}
            ${!open && "justify-center"}`}
          onClick={() => handleMenuClick(menu.title)}
        >
          {menu.icon}
          {open && <span>{menu.title}</span>}
        </div>
      </Link>
    </li>
  )
}

