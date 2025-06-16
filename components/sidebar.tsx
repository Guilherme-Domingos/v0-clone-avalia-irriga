"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { LayoutGrid, FileText, User, Menu, X, Home } from "lucide-react"
import { cn } from "@/lib/utils"

interface SidebarProps {
  activeItem?: "fazendas" | "areas" | "relatorios" | "perfil"
}

export function Sidebar({ activeItem }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  const menuItems = [
    {
      key: "fazendas",
      label: "Propriedades",
      icon: LayoutGrid,
      href: "/fazendas",
      active: activeItem === "fazendas" || activeItem === "areas",
    },
    {
      key: "relatorios",
      label: "Relatórios",
      icon: FileText,
      href: "/relatorios",
      active: activeItem === "relatorios",
    },
    {
      key: "perfil",
      label: "Perfil",
      icon: User,
      href: "/perfil",
      active: activeItem === "perfil",
    },
  ]

  return (
    <>
      {/* Mobile Menu Button */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 md:hidden bg-white shadow-md"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {/* Overlay for mobile */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden" onClick={() => setIsOpen(false)} />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          "fixed left-0 top-0 h-full bg-teal-600 text-white z-50 transition-transform duration-300 ease-in-out",
          "w-64 md:w-72",
          isOpen ? "translate-x-0" : "-translate-x-full",
          "md:translate-x-0 md:relative md:z-auto",
        )}
      >
        <div className="p-6">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
              <Home className="h-6 w-6 text-teal-600" />
            </div>
            <h1 className="text-xl font-bold">AvaliaIrriga</h1>
          </div>

          <nav className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.key}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
                    item.active ? "bg-teal-700 text-white" : "text-teal-100 hover:bg-teal-700 hover:text-white",
                  )}
                >
                  <Icon className="h-5 w-5" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              )
            })}
          </nav>
        </div>

        {/* User info at bottom */}
        <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-teal-500">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-teal-500 rounded-full flex items-center justify-center">
              <User className="h-4 w-4" />
            </div>
            <div className="text-sm">
              <p className="font-medium">João Silva</p>
              <p className="text-teal-200 text-xs">Técnico Responsável</p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
