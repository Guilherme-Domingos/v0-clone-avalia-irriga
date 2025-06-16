"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { LayoutWrapper } from "@/components/layout-wrapper"
import { Camera, Save, LogOut } from "lucide-react"

export default function Perfil() {
  const router = useRouter()
  const [user, setUser] = useState({
    name: "João Silva",
    email: "joao.silva@email.com",
    organization: "Empresa de Irrigação Ltda.",
    phone: "(88) 99999-9999",
    position: "Técnico Responsável",
  })

  const handleSave = () => {
    // Aqui seria a integração com o backend para salvar os dados
    console.log("Salvando dados do usuário:", user)
    alert("Dados salvos com sucesso!")
  }

  return (
    <LayoutWrapper activeItem="perfil">
      <div className="flex flex-col h-full">
        <header className="bg-teal-600 text-white p-4 md:p-6">
          <h1 className="text-xl md:text-2xl font-bold ml-12 md:ml-0">Perfil do Usuário</h1>
        </header>

        <main className="flex-1 p-4 md:p-6 max-w-4xl mx-auto w-full">
          <div className="space-y-6 md:space-y-8">
            {/* Avatar Section */}
            <Card className="p-6 md:p-8">
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="relative">
                  <Avatar className="h-24 w-24 md:h-32 md:w-32">
                    <AvatarImage src="/placeholder.svg?height=128&width=128" alt={user.name} />
                    <AvatarFallback className="text-2xl md:text-3xl bg-teal-100 text-teal-600">
                      {user.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <Button
                    size="icon"
                    className="absolute -bottom-2 -right-2 rounded-full bg-teal-600 hover:bg-teal-700"
                  >
                    <Camera className="h-4 w-4" />
                  </Button>
                </div>

                <div className="text-center md:text-left">
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900">{user.name}</h2>
                  <p className="text-gray-600 text-lg">{user.position}</p>
                  <p className="text-gray-500">{user.organization}</p>
                </div>
              </div>
            </Card>

            {/* Form Section */}
            <Card className="p-6 md:p-8">
              <h3 className="text-xl font-semibold mb-6">Informações Pessoais</h3>

              <form
                className="space-y-6"
                onSubmit={(e) => {
                  e.preventDefault()
                  handleSave()
                }}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nome Completo</Label>
                    <Input
                      id="name"
                      value={user.name}
                      onChange={(e) => setUser({ ...user, name: e.target.value })}
                      className="h-12"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="position">Cargo/Posição</Label>
                    <Input
                      id="position"
                      value={user.position}
                      onChange={(e) => setUser({ ...user, position: e.target.value })}
                      className="h-12"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={user.email}
                      onChange={(e) => setUser({ ...user, email: e.target.value })}
                      className="h-12"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Telefone</Label>
                    <Input
                      id="phone"
                      value={user.phone}
                      onChange={(e) => setUser({ ...user, phone: e.target.value })}
                      className="h-12"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="organization">Organização</Label>
                  <Input
                    id="organization"
                    value={user.organization}
                    onChange={(e) => setUser({ ...user, organization: e.target.value })}
                    className="h-12"
                  />
                </div>

                <div className="flex flex-col md:flex-row gap-4 pt-6">
                  <Button
                    type="submit"
                    className="flex-1 md:flex-none bg-teal-600 hover:bg-teal-700 text-white h-12 px-8"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Salvar Alterações
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1 md:flex-none border-red-500 text-red-500 hover:bg-red-50 h-12 px-8"
                    onClick={() => router.push("/login")}
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Sair da Conta
                  </Button>
                </div>
              </form>
            </Card>

            {/* Statistics Card */}
            <Card className="p-6 md:p-8">
              <h3 className="text-xl font-semibold mb-6">Estatísticas</h3>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-teal-50 rounded-lg">
                  <p className="text-2xl font-bold text-teal-600">5</p>
                  <p className="text-sm text-gray-600">Propriedades</p>
                </div>

                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <p className="text-2xl font-bold text-blue-600">12</p>
                  <p className="text-sm text-gray-600">Avaliações</p>
                </div>

                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <p className="text-2xl font-bold text-green-600">8</p>
                  <p className="text-sm text-gray-600">Relatórios</p>
                </div>

                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <p className="text-2xl font-bold text-purple-600">3</p>
                  <p className="text-sm text-gray-600">Meses Ativo</p>
                </div>
              </div>
            </Card>
          </div>
        </main>
      </div>
    </LayoutWrapper>
  )
}
