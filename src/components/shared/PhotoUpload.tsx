interface PhotoUploadProps {
  value?: string
  onChange: (base64: string | undefined) => void
}

export function PhotoUpload({ value, onChange }: PhotoUploadProps) {
  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      onChange(reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  return (
    <div className="flex items-center gap-3">
      {value && (
        <img src={value} alt="Foto" className="w-16 h-16 rounded-full object-cover" />
      )}
      <div className="flex gap-2">
        <label className="cursor-pointer text-sm text-blue-600 hover:underline">
          {value ? 'Ändern' : 'Foto hochladen'}
          <input type="file" accept="image/*" className="hidden" onChange={handleFile} />
        </label>
        {value && (
          <button className="text-sm text-red-500 hover:underline" onClick={() => onChange(undefined)}>
            Entfernen
          </button>
        )}
      </div>
    </div>
  )
}
