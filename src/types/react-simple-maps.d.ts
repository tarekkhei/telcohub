declare module 'react-simple-maps' {
  import type { ReactNode } from 'react'

  export function ComposableMap(props: {
    projectionConfig?: {
      scale?: number
      center?: [number, number]
    }
    width?: number
    height?: number
    className?: string
    children?: ReactNode
  }): ReactNode

  export function Geographies(props: {
    geography: string | object
    children: (data: { geographies: Array<{ rsmKey: string } & Record<string, unknown>> }) => ReactNode
  }): ReactNode

  export function Geography(props: {
    geography: object
    fill?: string
    stroke?: string
    strokeWidth?: number
    style?: {
      default?: Record<string, string | number>
      hover?: Record<string, string | number>
      pressed?: Record<string, string | number>
    }
  }): ReactNode

  export function Marker(props: {
    coordinates: [number, number]
    children?: ReactNode
  }): ReactNode
}
