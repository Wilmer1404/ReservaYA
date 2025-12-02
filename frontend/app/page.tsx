// app/page.tsx
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import {
  Calendar,
  Users,
  Zap,
  ArrowRight,
  BookOpen,
  Dumbbell,
  Microscope,
  Users2,
  Check,
} from "lucide-react";
import Navbar from "@/components/navbar";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-slate-50">
      <Navbar />

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-5xl md:text-6xl font-bold text-slate-900 text-balance">
                Organiza, gestiona y reserva tus espacios fácilmente
              </h1>
              <p className="text-xl text-slate-600 text-balance">
                ReservaYA es la plataforma ideal para que instituciones gestionen sus recursos y ofrezcan reservas de forma simple y visual.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/register">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto">
                  Regístrate como institución
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <Link href="#features">
                <Button size="lg" variant="outline" className="w-full sm:w-auto bg-transparent">
                  Conocer más
                </Button>
              </Link>
            </div>
          </div>

          {/* Hero Image */}
          <div className="relative h-96 md:h-full">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-green-100 rounded-2xl opacity-60"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="grid grid-cols-2 gap-4 p-8">
                {[
                  { icon: Dumbbell, color: "text-blue-600", label: "Canchas" },
                  { icon: Microscope, color: "text-green-600", label: "Laboratorios" },
                  { icon: BookOpen, color: "text-blue-600", label: "Salas" },
                  { icon: Users2, color: "text-green-600", label: "Recursos" },
                ].map((item, i) => (
                  <div key={i} className="bg-white rounded-lg p-4 shadow-lg flex flex-col items-center gap-2">
                    <item.icon className={`w-8 h-8 ${item.color}`} />
                    <span className="text-sm font-medium text-slate-700">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="bg-white py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              Características principales
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Todo lo que necesitas para gestionar tus espacios de forma eficiente
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Calendar,
                title: "Calendario intuitivo",
                description: "Visualiza todas tus reservas en un calendario fácil de usar y gestiona disponibilidades.",
              },
              {
                icon: Users,
                title: "Gestión de usuarios",
                description: "Controla quién puede reservar tus espacios y mantén un registro completo de usuarios.",
              },
              {
                icon: Zap,
                title: "Reservas rápidas",
                description: "Permite que tus usuarios reserven espacios en segundos con una interfaz intuitiva.",
              },
            ].map((feature, idx) => (
              <Card key={idx} className="p-8 border border-slate-200 hover:shadow-lg transition-shadow">
                <feature.icon className="w-12 h-12 text-blue-600 mb-4" />
                <h3 className="text-xl font-bold text-slate-900 mb-2">{feature.title}</h3>
                <p className="text-slate-600">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 to-green-600 py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 text-balance">
            ¿Listo para transformar la gestión de tus espacios?
          </h2>
          <p className="text-xl text-blue-50 mb-8 text-balance">
            Únete a cientos de instituciones que ya confían en ReservaYA
          </p>
          <Link href="/register">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-slate-100">
              Comienza ahora
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="w-full py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-12">
            Un plan simple para todos
          </h2>
          <div className="flex justify-center">
            <Card className="w-full max-w-md p-8 border-2 border-blue-600 shadow-2xl rounded-lg">
              <CardHeader className="p-0 mb-6">
                <CardTitle className="text-2xl font-bold text-slate-900 mb-2">
                  Plan Institucional
                </CardTitle>
                <CardDescription className="text-slate-600">
                  Perfecto para empezar a organizar.
                </CardDescription>
              </CardHeader>
              <p className="text-5xl font-bold text-slate-900 mb-6">
                Gratis <span className="text-lg font-normal text-slate-600">/ beta</span>
              </p>
              <ul className="space-y-3 text-left mb-8">
                {[
                  "Gestión de espacios ilimitados",
                  "Gestión de usuarios",
                  "Sistema de reservas en línea",
                  "Soporte básico",
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-green-500" />
                    <span className="text-slate-700">{item}</span>
                  </li>
                ))}
              </ul>
              <Button
                asChild
                size="lg"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white text-lg px-8 py-6"
              >
                <Link href="/register">Regístrate gratis</Link>
              </Button>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-300 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-white" />
                </div>
                <span className="font-bold text-white">ReservaYA</span>
              </div>
              <p className="text-sm">Gestión de espacios simplificada</p>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">Producto</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#features" className="hover:text-white transition">Características</a></li>
                <li><a href="#" className="hover:text-white transition">Precios</a></li>
                <li><a href="#" className="hover:text-white transition">Seguridad</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">Empresa</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition">Acerca de</a></li>
                <li><a href="#" className="hover:text-white transition">Blog</a></li>
                <li><Link href="/contact" className="hover:text-white transition">Contacto</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition">Privacidad</a></li>
                <li><a href="#" className="hover:text-white transition">Términos</a></li>
                <li><a href="#" className="hover:text-white transition">Cookies</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 pt-8 text-center text-sm">
            <p>&copy; {new Date().getFullYear()} ReservaYA. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
