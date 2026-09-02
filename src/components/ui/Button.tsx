import type { ButtonHTMLAttributes, ReactNode } from 'react'

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'ai'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  children: ReactNode
}

const variants: Record<Variant, string> = {
  primary: 'bg-accent text-white hover:bg-blue-700',
  secondary: 'bg-white text-navy-800 border border-navy-200 hover:bg-navy-50',
  ghost: 'bg-transparent text-navy-700 hover:bg-navy-50',
  danger: 'bg-white text-danger border border-red-200 hover:bg-danger-soft',
  ai: 'bg-ai text-white hover:bg-indigo-600',
}

export function Button({ variant = 'primary', className = '', children, ...props }: ButtonProps) {
  return (
    <button
      className={`inline-flex min-h-10 items-center justify-center gap-2 rounded-lg px-3.5 py-2 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-50 ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
