import { Card } from "@/components/ui/card"
import type { LucideIcon } from "lucide-react"

interface StatCardProps {
  label: string
  value: string
  Icon: LucideIcon
  color: string
  change?: string
}

export function StatCard({ label, value, Icon, color, change }: StatCardProps) {
  return (
    <Card className="p-6 border border-slate-200">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-slate-600 text-sm font-medium">{label}</p>
          <p className="text-3xl font-bold text-slate-900 mt-2">{value}</p>
          {change && <p className="text-xs text-green-600 mt-2">{change}</p>}
        </div>
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </Card>
  )
}