/**
 * Save a blob using the File System Access API (save dialog) with fallback
 * for browsers that don't support it.
 */
export async function saveBlob(
  blob: Blob,
  defaultName: string,
  mimeType: string,
  description: string
): Promise<void> {
  // Try native save dialog (Chrome, Edge, Opera)
  if ('showSaveFilePicker' in window) {
    try {
      const ext = defaultName.split('.').pop() ?? ''
      const handle = await (window as unknown as { showSaveFilePicker: (opts: unknown) => Promise<FileSystemFileHandle> }).showSaveFilePicker({
        suggestedName: defaultName,
        types: [
          {
            description,
            accept: { [mimeType]: [`.${ext}`] },
          },
        ],
      })
      const writable = await handle.createWritable()
      await writable.write(blob)
      await writable.close()
      return
    } catch (e) {
      // User cancelled the dialog
      if (e instanceof DOMException && e.name === 'AbortError') return
      // Fall through to legacy approach
    }
  }

  // Fallback: programmatic download
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = defaultName
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}
