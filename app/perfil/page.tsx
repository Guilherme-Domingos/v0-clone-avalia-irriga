"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { NavBar } from "@/components/nav-bar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function Perfil() {
  const router = useRouter()
  const [user, setUser] = useState({
    name: "João Silva",
    email: "joao.silva@email.com",
    organization: "Empresa de Irrigação Ltda.",
  })

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <header className="bg-teal-600 text-white p-4">
        <h1 className="text-xl font-bold">Perfil</h1>
      </header>

      <main className="flex-1 p-4 space-y-6">
        <div className="flex flex-col items-center justify-center mb-6">
          <Avatar className="h-24 w-24">
            <AvatarImage src="/placeholder.svg?height=96&width=96" alt={user.name} />
            <AvatarFallback className="text-2xl bg-teal-100 text-teal-600">
              {user.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <h2 className="mt-4 text-xl font-semibold">{user.name}</h2>
          <p className="text-gray-600">{user.email}</p>
        </div>

        <Card className="p-4">
          <form className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome</Label>
              <Input id="name" value={user.name} onChange={(e) => setUser({ ...user, name: e.target.value })} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={user.email}
                onChange={(e) => setUser({ ...user, email: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="organization">Organização</Label>
              <Input
                id="organization"
                value={user.organization}
                onChange={(e) => setUser({ ...user, organization: e.target.value })}
              />
            </div>

            <Button type="submit" className="w-full bg-teal-600 hover:bg-teal-700 text-white">
              Salvar alterações
            </Button>
          </form>
        </Card>

        <Button
          variant="outline"
          className="w-full border-red-500 text-red-500 hover:bg-red-50"
          onClick={() => router.push("/login")}
        >
          Sair
        </Button>
      </main>

      <NavBar activeItem="perfil" />
    </div>
  )
}
