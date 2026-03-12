const sizeMap = { sm: 48, md: 64, lg: 88 }

export function getPhotoDimensions(size: 'sm' | 'md' | 'lg') {
  const px = sizeMap[size]
  return { width: px, height: px }
}

export function getPhotoBorderRadius(
  shape: 'round' | 'square' | 'rounded',
  size: 'sm' | 'md' | 'lg'
) {
  const px = sizeMap[size]
  if (shape === 'round') return px / 2
  if (shape === 'rounded') return 6
  return 0
}
