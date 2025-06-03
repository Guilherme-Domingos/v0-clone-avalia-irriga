import { Button } from "@/components/ui/button"
import { NavBar } from "@/components/nav-bar"
import { ChevronLeft } from "lucide-react"
import Link from "next/link"

interface PageLayoutProps {
  children: React.ReactNode
  title: string
  showBackButton?: boolean
  backHref?: string
  onBack?: () => void
  actions?: React.ReactNode
  className?: string
}

export function PageLayout({
  children,
  title,
  showBackButton = false,
  backHref,
  onBack,
  actions,
  className = ""
}: PageLayoutProps) {
  return (
    <div className={`flex flex-col min-h-screen bg-gray-50 ${className}`}>
      <header className="bg-teal-600 text-white p-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          {showBackButton && (
            <>
              {backHref ? (
                <Button variant="ghost" size="icon" className="text-white" asChild>
                  <Link href={backHref}>
                    <ChevronLeft className="h-5 w-5" />
                  </Link>
                </Button>
              ) : (
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="text-white" 
                  onClick={onBack}
                >
                  <ChevronLeft className="h-5 w-5" />
                </Button>
              )}
            </>
          )}
          <h1 className="text-xl font-bold">{title}</h1>
        </div>
        {actions && (
          <div className="flex items-center gap-2">
            {actions}
          </div>
        )}
      </header>

      <main className="flex-1">
        {children}
      </main>

      <NavBar activeItem="areas" />
    </div>
  )
}

interface PageContentProps {
  children: React.ReactNode
  className?: string
  maxWidth?: "sm" | "md" | "lg" | "xl" | "full"
}

export function PageContent({ 
  children, 
  className = "", 
  maxWidth = "full" 
}: PageContentProps) {
  const maxWidthClasses = {
    sm: "max-w-sm",
    md: "max-w-md", 
    lg: "max-w-lg",
    xl: "max-w-xl",
    full: "max-w-none"
  }

  return (
    <div className={`p-4 pb-20 ${maxWidthClasses[maxWidth]} mx-auto w-full ${className}`}>
      {children}
    </div>
  )
}
