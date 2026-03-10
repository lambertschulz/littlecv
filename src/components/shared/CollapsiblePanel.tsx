import { useState, type ReactNode } from 'react'

interface CollapsiblePanelProps {
  title: string
  defaultOpen?: boolean
  children: ReactNode
}

export function CollapsiblePanel({
  title,
  defaultOpen = true,
  children,
}: CollapsiblePanelProps) {
  const [open, setOpen] = useState(defaultOpen)

  return (
    <div className="border-b border-gray-200">
      <button
        className="w-full flex items-center justify-between px-4 py-3 text-left font-semibold text-gray-700 hover:bg-gray-50"
        onClick={() => setOpen(!open)}
      >
        {title}
        <span className={`transition-transform ${open ? 'rotate-180' : ''}`}>
          &#9662;
        </span>
      </button>
      {open && <div className="px-4 pb-4">{children}</div>}
    </div>
  )
}
