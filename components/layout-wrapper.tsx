"use client"

import type React from "react"

import { Sidebar } from "@/components/sidebar"
import { NavBar } from "@/components/nav-bar"
import { useMediaQuery } from "@/hooks/use-media-query"

interface LayoutWrapperProps {
  children: React.ReactNode
  activeItem?: "fazendas" | "areas" | "relatorios" | "perfil"
  showNavBar?: boolean
}

export function LayoutWrapper({ children, activeItem, showNavBar = true }: LayoutWrapperProps) {
  const isDesktop = useMediaQuery("(min-width: 768px)")

  return (
    <div className="flex h-screen bg-gray-50">
      {isDesktop && <Sidebar activeItem={activeItem} />}

      <div className="flex-1 flex flex-col overflow-hidden">
        {!isDesktop && <Sidebar activeItem={activeItem} />}

        <main className="flex-1 overflow-auto">{children}</main>

        {!isDesktop && showNavBar && <NavBar activeItem={activeItem || "fazendas"} />}
      </div>
    </div>
  )
}
