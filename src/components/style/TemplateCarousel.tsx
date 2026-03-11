import { useState } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import { useAtom } from 'jotai'
import { HeartIcon } from 'lucide-react'
import { activeTemplateKeyAtom, favoriteTemplatesAtom } from '@/state/atoms'
import { templateRegistry } from '@/templates/registry'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export function TemplateCarousel() {
  const [activeKey, setActiveKey] = useAtom(activeTemplateKeyAtom)
  const [favorites, setFavorites] = useAtom(favoriteTemplatesAtom)
  const [filter, setFilter] = useState<'all' | 'favorites'>('all')

  const [emblaRef] = useEmblaCarousel({ align: 'start', dragFree: true })

  const templates =
    filter === 'favorites'
      ? templateRegistry.filter((t) => favorites.includes(t.key))
      : templateRegistry

  const toggleFavorite = (key: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setFavorites((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    )
  }

  return (
    <div className="p-4 space-y-3">
      {/* Filter toggle */}
      <div className="flex gap-2">
        <Button
          size="sm"
          variant={filter === 'all' ? 'default' : 'outline'}
          onClick={() => setFilter('all')}
        >
          Alle
        </Button>
        <Button
          size="sm"
          variant={filter === 'favorites' ? 'default' : 'outline'}
          onClick={() => setFilter('favorites')}
        >
          Favoriten
        </Button>
      </div>

      {/* Carousel */}
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex gap-3">
          {templates.length === 0 ? (
            <p className="text-sm text-muted-foreground py-4">Keine Favoriten gespeichert.</p>
          ) : (
            templates.map((t) => {
              const isActive = t.key === activeKey
              const isFav = favorites.includes(t.key)
              return (
                <div
                  key={t.key}
                  className={cn(
                    'relative flex-none w-28 cursor-pointer rounded-lg border-2 overflow-hidden transition-all',
                    isActive
                      ? 'border-primary ring-2 ring-primary/30'
                      : 'border-border hover:border-muted-foreground'
                  )}
                  onClick={() => setActiveKey(t.key)}
                >
                  {/* Thumbnail */}
                  <img
                    src={t.thumbnail}
                    alt={t.label}
                    className="w-full h-36 object-cover object-top bg-muted"
                  />
                  {/* Label overlay */}
                  <div className="absolute bottom-0 inset-x-0 bg-background/80 backdrop-blur-sm px-2 py-1">
                    <p className="text-xs font-medium truncate">{t.label}</p>
                  </div>
                  {/* Heart button */}
                  <button
                    className={cn(
                      'absolute top-1.5 right-1.5 rounded-full p-1 bg-background/70 backdrop-blur-sm transition-colors',
                      isFav ? 'text-red-500' : 'text-muted-foreground hover:text-red-400'
                    )}
                    onClick={(e) => toggleFavorite(t.key, e)}
                    aria-label={isFav ? 'Aus Favoriten entfernen' : 'Zu Favoriten hinzufügen'}
                  >
                    <HeartIcon
                      className="size-3.5"
                      fill={isFav ? 'currentColor' : 'none'}
                    />
                  </button>
                </div>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}
