import { useState, useCallback } from 'react'
import Cropper from 'react-easy-crop'
import type { Area } from 'react-easy-crop'
import { Button } from '@/components/ui/button'

interface PhotoCropperProps {
  rawPhoto: string
  croppedPhoto?: string
  photoShape: 'round' | 'square' | 'rounded'
  onCropDone: (base64: string) => void
  onCropClear: () => void
}

async function getCroppedImg(src: string, crop: Area): Promise<string> {
  const image = new Image()
  image.src = src
  await new Promise((resolve) => {
    image.onload = resolve
  })

  const canvas = document.createElement('canvas')
  canvas.width = crop.width
  canvas.height = crop.height
  const ctx = canvas.getContext('2d')!
  ctx.drawImage(image, crop.x, crop.y, crop.width, crop.height, 0, 0, crop.width, crop.height)
  return canvas.toDataURL('image/jpeg', 0.92)
}

export function PhotoCropper({
  rawPhoto,
  croppedPhoto,
  photoShape,
  onCropDone,
  onCropClear,
}: PhotoCropperProps) {
  const [editing, setEditing] = useState(false)
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [croppedArea, setCroppedArea] = useState<Area | null>(null)

  const onCropComplete = useCallback((_: Area, croppedPixels: Area) => {
    setCroppedArea(croppedPixels)
  }, [])

  const handleSave = async () => {
    if (!croppedArea) return
    const cropped = await getCroppedImg(rawPhoto, croppedArea)
    onCropDone(cropped)
    setEditing(false)
  }

  const handleCancel = () => {
    setEditing(false)
    setCrop({ x: 0, y: 0 })
    setZoom(1)
  }

  const cropShape = photoShape === 'round' ? 'round' : 'rect'

  if (editing) {
    return (
      <div className="space-y-3">
        <p className="text-xs font-medium text-muted-foreground">Foto zuschneiden</p>
        <div className="relative w-full h-56 bg-gray-900 rounded overflow-hidden">
          <Cropper
            image={rawPhoto}
            crop={crop}
            zoom={zoom}
            aspect={1}
            cropShape={cropShape}
            showGrid={false}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
          />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">Zoom</span>
          <input
            type="range"
            min={1}
            max={3}
            step={0.05}
            value={zoom}
            onChange={(e) => setZoom(Number(e.target.value))}
            className="flex-1"
          />
        </div>
        <div className="flex gap-2">
          <Button size="sm" onClick={handleSave}>
            Übernehmen
          </Button>
          <Button size="sm" variant="outline" onClick={handleCancel}>
            Abbrechen
          </Button>
        </div>
      </div>
    )
  }

  const previewSrc = croppedPhoto || rawPhoto
  const previewClass = photoShape === 'round'
    ? 'w-14 h-14 rounded-full'
    : photoShape === 'rounded'
      ? 'w-14 h-14 rounded-md'
      : 'w-14 h-14'

  return (
    <div>
      <p className="text-xs font-medium text-muted-foreground mb-2">Foto</p>
      <div className="flex items-center gap-3">
        <img src={previewSrc} alt="Foto" className={`${previewClass} object-cover`} />
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              setCrop({ x: 0, y: 0 })
              setZoom(1)
              setEditing(true)
            }}
          >
            Zuschneiden
          </Button>
          {croppedPhoto && (
            <Button size="sm" variant="ghost" onClick={onCropClear}>
              Zurücksetzen
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
