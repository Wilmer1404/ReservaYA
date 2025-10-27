"use client"

// Forzar renderizado dinámico
export const dynamic = 'force-dynamic';

import { Sidebar } from "@/components/sidebar"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, TrendingUp } from "lucide-react"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart"

export default function AnalyticsPage() {
  // Reservations trend data
  const reservationsTrendData = [
    { date: "Lun", reservations: 45, confirmadas: 38, pendientes: 7 },
    { date: "Mar", reservations: 52, confirmadas: 44, pendientes: 8 },
    { date: "Mié", reservations: 48, confirmadas: 41, pendientes: 7 },
    { date: "Jue", reservations: 61, confirmadas: 52, pendientes: 9 },
    { date: "Vie", reservations: 55, confirmadas: 47, pendientes: 8 },
    { date: "Sáb", reservations: 67, confirmadas: 58, pendientes: 9 },
    { date: "Dom", reservations: 42, confirmadas: 36, pendientes: 6 },
  ]

  // Space usage data
  const spaceUsageData = [
    { name: "Cancha de fútbol A", usage: 85 },
    { name: "Sala de estudio 1", usage: 72 },
    { name: "Laboratorio de química", usage: 68 },
    { name: "Cancha de básquet", usage: 78 },
    { name: "Sala de conferencias", usage: 55 },
    { name: "Biblioteca", usage: 92 },
  ]

  // Space type distribution
  const spaceTypeData = [
    { name: "Deporte", value: 35, color: "#3b82f6" },
    { name: "Estudio", value: 28, color: "#10b981" },
    { name: "Laboratorio", value: 18, color: "#f59e0b" },
    { name: "Reunión", value: 12, color: "#8b5cf6" },
    { name: "Biblioteca", value: 7, color: "#ef4444" },
  ]

  // Occupancy trend
  const occupancyTrendData = [
    { time: "08:00", occupancy: 25 },
    { time: "10:00", occupancy: 45 },
    { time: "12:00", occupancy: 72 },
    { time: "14:00", occupancy: 88 },
    { time: "16:00", occupancy: 65 },
    { time: "18:00", occupancy: 42 },
    { time: "20:00", occupancy: 18 },
  ]

  // User activity
  const userActivityData = [
    { week: "Sem 1", usuarios: 120, reservas: 245 },
    { week: "Sem 2", usuarios: 135, reservas: 278 },
    { week: "Sem 3", usuarios: 148, reservas: 312 },
    { week: "Sem 4", usuarios: 162, reservas: 356 },
  ]

  const chartConfig = {
    reservations: {
      label: "Reservas",
      color: "#3b82f6",
    },
    confirmadas: {
      label: "Confirmadas",
      color: "#10b981",
    },
    pendientes: {
      label: "Pendientes",
      color: "#f59e0b",
    },
    usuarios: {
      label: "Usuarios",
      color: "#3b82f6",
    },
    reservas: {
      label: "Reservas",
      color: "#8b5cf6",
    },
  }

  const stats = [
    { label: "Total de reservas", value: "1,247", change: "+12.5%", color: "bg-blue-100 text-blue-600" },
    { label: "Tasa de ocupación", value: "68%", change: "+5.2%", color: "bg-green-100 text-green-600" },
    { label: "Usuarios activos", value: "562", change: "+8.3%", color: "bg-purple-100 text-purple-600" },
    { label: "Espacios disponibles", value: "12", change: "-2.1%", color: "bg-orange-100 text-orange-600" },
  ]

  return (
    <div className="flex h-screen bg-slate-50">
      <Sidebar activeTab="analytics" />

      <main className="flex-1 overflow-auto md:ml-0">
        <div className="p-4 md:p-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Análisis y Estadísticas</h1>
              <p className="text-slate-600 mt-2">Visualiza el rendimiento de tus espacios y reservas</p>
            </div>
            <Button className="bg-blue-600 hover:bg-blue-700 mt-4 md:mt-0">
              <Download className="w-4 h-4 mr-2" />
              Descargar reporte
            </Button>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {stats.map((stat, idx) => (
              <Card key={idx} className="p-4 border border-slate-200">
                <p className="text-slate-600 text-sm font-medium">{stat.label}</p>
                <div className="flex items-center justify-between mt-2">
                  <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                  <div className={`p-2 rounded-lg ${stat.color}`}>
                    <TrendingUp className="w-5 h-5" />
                  </div>
                </div>
                <p className="text-xs text-green-600 mt-2">{stat.change} vs semana anterior</p>
              </Card>
            ))}
          </div>

          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Reservations Trend */}
            <Card className="p-6 border border-slate-200">
              <h3 className="text-lg font-bold text-slate-900 mb-4">Tendencia de reservas</h3>
              <ChartContainer config={chartConfig} className="h-80">
                <LineChart data={reservationsTrendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <ChartLegend content={<ChartLegendContent payload={undefined} />} />
                  <Line type="monotone" dataKey="confirmadas" stroke="var(--color-confirmadas)" strokeWidth={2} />
                  <Line type="monotone" dataKey="pendientes" stroke="var(--color-pendientes)" strokeWidth={2} />
                </LineChart>
              </ChartContainer>
            </Card>

            {/* Space Usage */}
            <Card className="p-6 border border-slate-200">
              <h3 className="text-lg font-bold text-slate-900 mb-4">Uso de espacios</h3>
              <ChartContainer config={chartConfig} className="h-80">
                <BarChart data={spaceUsageData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="usage" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ChartContainer>
            </Card>

            {/* Occupancy Trend */}
            <Card className="p-6 border border-slate-200">
              <h3 className="text-lg font-bold text-slate-900 mb-4">Ocupación por hora</h3>
              <ChartContainer config={chartConfig} className="h-80">
                <AreaChart data={occupancyTrendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Area type="monotone" dataKey="occupancy" fill="#10b981" stroke="#10b981" />
                </AreaChart>
              </ChartContainer>
            </Card>

            {/* Space Type Distribution */}
            <Card className="p-6 border border-slate-200">
              <h3 className="text-lg font-bold text-slate-900 mb-4">Distribución por tipo</h3>
              <ChartContainer config={chartConfig} className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={spaceTypeData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {spaceTypeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <ChartTooltip content={<ChartTooltipContent />} />
                  </PieChart>
                </ResponsiveContainer>
              </ChartContainer>
            </Card>
          </div>

          {/* User Activity */}
          <Card className="p-6 border border-slate-200">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Actividad de usuarios</h3>
            <ChartContainer config={chartConfig} className="h-80">
              <BarChart data={userActivityData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="week" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <ChartTooltip content={<ChartTooltipContent />} />
                <ChartLegend content={<ChartLegendContent payload={undefined} />} />
                <Bar yAxisId="left" dataKey="usuarios" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                <Bar yAxisId="right" dataKey="reservas" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ChartContainer>
          </Card>
        </div>
      </main>
    </div>
  )
}
