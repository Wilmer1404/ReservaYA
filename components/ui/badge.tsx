// components/ui/badge.tsx
import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

// --- ESTA ES LA ÚNICA DEFINICIÓN QUE DEBE QUEDAR ---
const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80", // Ajustado para coincidir con el original, puedes cambiar text-white si prefieres
        outline: "text-foreground",
        // --- VARIANTES AÑADIDAS ---
        success: // Para estados confirmados (verde)
          "border-transparent bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
        warning: // Para estados pendientes (ámbar/amarillo)
           "border-transparent bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

// Interfaz de Props (No cambia)
export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>, // Cambiado span a div si prefieres, o manten span
    VariantProps<typeof badgeVariants> {}

// Componente Badge (No cambia)
function Badge({ className, variant, ...props }: BadgeProps) {
  // Nota: El código original usaba 'span', aquí usamos 'div'. Puedes cambiarlo a 'span' si es necesario.
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

// Exportaciones (No cambian)
export { Badge, badgeVariants }