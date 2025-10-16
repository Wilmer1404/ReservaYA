"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Link from "next/link"
import { Mail, Phone, MapPin, Send } from "lucide-react"

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Mensaje enviado:", formData)
    setFormData({ name: "", email: "", subject: "", message: "" })
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-slate-50">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl text-slate-900">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Mail className="w-5 h-5 text-white" />
            </div>
            ReservaYA
          </Link>
          <Link href="/">
            <Button variant="ghost">Volver</Button>
          </Link>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-4 text-balance">¿Necesitas ayuda?</h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto text-balance">
            Estamos aquí para responder tus preguntas y ayudarte a sacar el máximo provecho de ReservaYA
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {[
            {
              icon: Mail,
              title: "Correo electrónico",
              description: "Envíanos un mensaje",
              contact: "soporte@reservaya.com",
            },
            {
              icon: Phone,
              title: "Teléfono",
              description: "Llámanos directamente",
              contact: "+34 912 345 678",
            },
            {
              icon: MapPin,
              title: "Ubicación",
              description: "Visítanos en persona",
              contact: "Calle Principal 123, Madrid",
            },
          ].map((item, idx) => (
            <Card key={idx} className="p-8 border border-slate-200 text-center hover:shadow-lg transition-shadow">
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <item.icon className="w-6 h-6 text-blue-600" />
                </div>
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">{item.title}</h3>
              <p className="text-slate-600 mb-2">{item.description}</p>
              <p className="font-semibold text-slate-900">{item.contact}</p>
            </Card>
          ))}
        </div>

        {/* Contact Form */}
        <div className="max-w-2xl mx-auto">
          <Card className="p-8 border border-slate-200 shadow-lg">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Envíanos un mensaje</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Nombre</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Tu nombre"
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Correo electrónico</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="tu@email.com"
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Asunto</label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="¿Cuál es tu pregunta?"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Mensaje</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Cuéntanos más detalles..."
                  rows={6}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 py-2">
                <Send className="w-4 h-4 mr-2" />
                Enviar mensaje
              </Button>
            </form>
          </Card>
        </div>

        {/* FAQ Section */}
        <div className="mt-20">
          <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">Preguntas frecuentes</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                q: "¿Cómo registro mi institución?",
                a: "Haz clic en 'Registrarse' en la página de inicio y completa el formulario con los datos de tu institución.",
              },
              {
                q: "¿Cuál es el costo de ReservaYA?",
                a: "Ofrecemos diferentes planes según el tamaño de tu institución. Contáctanos para más información.",
              },
              {
                q: "¿Puedo integrar ReservaYA con otros sistemas?",
                a: "Sí, contamos con API disponible para integraciones personalizadas. Solicita más detalles a nuestro equipo.",
              },
              {
                q: "¿Qué soporte técnico ofrecen?",
                a: "Proporcionamos soporte por correo, teléfono y chat en vivo durante horario de oficina.",
              },
            ].map((faq, idx) => (
              <Card key={idx} className="p-6 border border-slate-200">
                <h3 className="font-bold text-slate-900 mb-2">{faq.q}</h3>
                <p className="text-slate-600">{faq.a}</p>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-300 py-12 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p>&copy; 2025 ReservaYA. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  )
}
