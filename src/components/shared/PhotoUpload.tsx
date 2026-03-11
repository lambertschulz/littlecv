import { useState, useCallback } from 'react'
import Cropper from 'react-easy-crop'
import type { Area } from 'react-easy-crop'
import { Button } from '@/components/ui/button'

interface PhotoUploadProps {
  value?: string
  onChange: (base64: string | undefined) => void
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

export function PhotoUpload({ value, onChange }: PhotoUploadProps) {
  const [rawImage, setRawImage] = useState<string | null>(null)
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [croppedArea, setCroppedArea] = useState<Area | null>(null)

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      setRawImage(reader.result as string)
      setCrop({ x: 0, y: 0 })
      setZoom(1)
    }
    reader.readAsDataURL(file)
  }

  const onCropComplete = useCallback((_: Area, croppedPixels: Area) => {
    setCroppedArea(croppedPixels)
  }, [])

  const handleSave = async () => {
    if (!rawImage || !croppedArea) return
    const cropped = await getCroppedImg(rawImage, croppedArea)
    onChange(cropped)
    setRawImage(null)
  }

  const handleCancel = () => {
    setRawImage(null)
  }

  // Crop editor modal
  if (rawImage) {
    return (
      <div className="space-y-3">
        <div className="relative w-full h-64 bg-gray-900 rounded overflow-hidden">
          <Cropper
            image={rawImage}
            crop={crop}
            zoom={zoom}
            aspect={1}
            cropShape="round"
            showGrid={false}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
          />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500">Zoom</span>
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
          <Button onClick={handleSave}>
            Übernehmen
          </Button>
          <Button variant="outline" onClick={handleCancel}>
            Abbrechen
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-3">
      {value && (
        <img src={value} alt="Foto" className="w-16 h-16 rounded-full object-cover" />
      )}
      <div className="flex gap-2">
        <label className="cursor-pointer text-sm text-primary hover:underline">
          {value ? 'Ändern' : 'Foto hochladen'}
          <input type="file" accept="image/*" className="hidden" onChange={handleFile} />
        </label>
        {value && (
          <>
            <Button
              variant="link"
              className="px-0 text-sm"
              onClick={() => {
                setRawImage(value)
                setCrop({ x: 0, y: 0 })
                setZoom(1)
              }}
            >
              Zuschneiden
            </Button>
            <Button
              variant="link"
              className="px-0 text-sm text-destructive"
              onClick={() => onChange(undefined)}
            >
              Entfernen
            </Button>
          </>
        )}
      </div>
    </div>
  )
}
