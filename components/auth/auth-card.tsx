import type React from "react"
import Link from "next/link"
import { Card } from "@/components/ui/card"
import { ArrowLeft, Calendar } from "lucide-react"

interface AuthCardProps {
  title: string
  description: string
  backLink?: boolean
  children: React.ReactNode
}

export function AuthCard({ title, description, backLink = true, children }: AuthCardProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {backLink && (
          <Link href="/" className="flex items-center gap-2 mb-8 text-slate-600 hover:text-slate-900">
            <ArrowLeft className="w-4 h-4" />
            Volver al inicio
          </Link>
        )}

        <Card className="p-8 border border-slate-200 shadow-lg">
          <div className="flex items-center gap-2 mb-8">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <Calendar className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900">ReservaYA</h1>
          </div>

          <h2 className="text-2xl font-bold text-slate-900 mb-2">{title}</h2>
          <p className="text-slate-600 mb-8">{description}</p>
          
          {children}
        </Card>
      </div>
    </div>
  )
}