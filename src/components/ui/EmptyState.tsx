import { SearchX } from 'lucide-react'
import { Button } from './Button'

export function EmptyState({
  title,
  description,
  onReset,
}: {
  title: string
  description: string
  onReset?: () => void
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-navy-200 bg-white px-6 py-16 text-center">
      <SearchX className="mb-3 h-8 w-8 text-navy-300" />
      <h3 className="text-sm font-semibold text-navy-900">{title}</h3>
      <p className="mt-1 max-w-md text-sm text-navy-500">{description}</p>
      {onReset ? (
        <Button variant="secondary" className="mt-4" onClick={onReset}>
          Clear filters
        </Button>
      ) : null}
    </div>
  )
}
