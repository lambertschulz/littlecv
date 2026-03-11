import { useAtom } from 'jotai'
import { activeViewAtom } from '../state/atoms'
import type { ReactNode } from 'react'

interface SplitPaneProps {
  editor: ReactNode
  preview: ReactNode
}

export function SplitPane({ editor, preview }: SplitPaneProps) {
  const [activeView] = useAtom(activeViewAtom)

  return (
    <div className="flex flex-1 overflow-hidden">
      <div
        className={`w-full md:w-1/2 overflow-y-auto border-r border-gray-200 bg-white ${
          activeView === 'preview' ? 'hidden md:block' : ''
        }`}
      >
        {editor}
      </div>
      <div
        className={`w-full md:w-1/2 overflow-y-auto bg-gray-100 ${
          activeView === 'editor' ? 'hidden md:block' : ''
        }`}
      >
        {preview}
      </div>
    </div>
  )
}
