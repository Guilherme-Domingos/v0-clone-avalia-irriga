import Link from "next/link"
import { LayoutGrid, FileText, User } from "lucide-react"

interface NavBarProps {
  activeItem: "areas" | "relatorios" | "perfil" | "fazendas"
}

export function NavBar({ activeItem }: NavBarProps) {
  return (
    <nav className="bg-teal-600 text-white py-3 px-6 flex justify-around items-center">
      <Link
        href="/fazendas"
        className={`flex flex-col items-center ${activeItem === "fazendas" || activeItem === "areas" ? "opacity-100" : "opacity-70"}`}
      >
        <LayoutGrid className="h-5 w-5" />
        <span className="text-xs mt-1">{activeItem === "fazendas" ? "propriedades" : "áreas"}</span>
      </Link>

      <Link
        href="/relatorios"
        className={`flex flex-col items-center ${activeItem === "relatorios" ? "opacity-100" : "opacity-70"}`}
      >
        <FileText className="h-5 w-5" />
        <span className="text-xs mt-1">relatórios</span>
      </Link>

      <Link
        href="/perfil"
        className={`flex flex-col items-center ${activeItem === "perfil" ? "opacity-100" : "opacity-70"}`}
      >
        <User className="h-5 w-5" />
        <span className="text-xs mt-1">perfil</span>
      </Link>
    </nav>
  )
}
