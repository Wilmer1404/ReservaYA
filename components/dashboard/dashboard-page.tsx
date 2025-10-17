import type React from "react"
import { Sidebar } from "@/components/sidebar"

interface DashboardPageProps {
  activeTab: string
  title: string
  description: string
  button?: React.ReactNode
  children: React.ReactNode
}

export function DashboardPage({
  activeTab,
  title,
  description,
  button,
  children,
}: DashboardPageProps) {
  return (
    <div className="flex h-screen bg-slate-50">
      <Sidebar activeTab={activeTab} />

      <main className="flex-1 overflow-auto md:ml-0">
        <div className="p-4 md:p-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">{title}</h1>
              <p className="text-slate-600 mt-2">{description}</p>
            </div>
            {button}
          </div>

          {/* Page Content */}
          {children}
        </div>
      </main>
    </div>
  )
}