import { useEffect, useRef, useState } from 'react'

export function useAsyncData<T>(loader: () => Promise<T>, deps: unknown[] = []) {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const loaderRef = useRef(loader)
  loaderRef.current = loader
  const depKey = JSON.stringify(deps)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)
    loaderRef
      .current()
      .then((result) => {
        if (!cancelled) setData(result)
      })
      .catch(() => {
        if (!cancelled) setError('Unable to load demo data.')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [depKey])

  return { data, loading, error }
}
