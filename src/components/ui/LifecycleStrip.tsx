import { LIFECYCLE_STAGES } from '../../data/constants'

export function LifecycleStrip({ active }: { active?: string }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-navy-100 bg-white px-3 py-3">
      <div className="flex min-w-max items-stretch gap-1 xl:min-w-0 xl:w-full">
        {LIFECYCLE_STAGES.map((stage, index) => {
          const isActive = active === stage.key
          return (
            <div key={stage.key} className="flex min-w-[9.5rem] items-center xl:min-w-0 xl:flex-1">
              <div className={`flex-1 rounded-lg px-2.5 py-2 ${isActive ? 'bg-ai-soft' : 'bg-navy-50'}`}>
                <p className={`text-[11px] font-semibold ${isActive ? 'text-ai' : 'text-navy-800'}`}>{stage.label}</p>
                <p className="mt-0.5 hidden line-clamp-2 text-[10px] leading-4 text-navy-500 sm:block">{stage.description}</p>
              </div>
              {index < LIFECYCLE_STAGES.length - 1 ? (
                <div className="mx-1 h-px w-3 shrink-0 bg-navy-200" />
              ) : null}
            </div>
          )
        })}
      </div>
    </div>
  )
}
