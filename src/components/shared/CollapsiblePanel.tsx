import { useState, type ReactNode } from 'react'
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from '@/components/ui/collapsible'

interface CollapsiblePanelProps {
  title: string
  defaultOpen?: boolean
  actions?: ReactNode
  children: ReactNode
}

export function CollapsiblePanel({
  title,
  defaultOpen = true,
  actions,
  children,
}: CollapsiblePanelProps) {
  const [open, setOpen] = useState(defaultOpen)

  return (
    <Collapsible open={open} onOpenChange={setOpen} className="border-b border-gray-200">
      <div className="flex items-center">
        <CollapsibleTrigger className="flex-1 flex items-center justify-between px-4 py-3 text-left font-semibold text-gray-700 hover:bg-gray-50">
          {title}
          <span className={`transition-transform ${open ? 'rotate-180' : ''}`}>
            &#9662;
          </span>
        </CollapsibleTrigger>
        {actions && <div className="pr-2">{actions}</div>}
      </div>
      <CollapsibleContent className="px-4 pb-4">
        {children}
      </CollapsibleContent>
    </Collapsible>
  )
}
