/**
 * Helper para resolver URLs de imagens vindas do backend Django ou de uploads locais.
 * Garante que caminhos relativos como `/media/...` sejam convertidos para a URL completa do backend.
 */
export function getImageUrl(url, fallback = 'https://placehold.co/600x400?text=Sem+Foto') {
  if (!url) return fallback

  // Se já for uma URL absoluta (http:// ou https://) ou data-url / blob
  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('blob:') || url.startsWith('data:')) {
    return url
  }

  // Base do backend Django
  const backendBase = 'http://127.0.0.1:8000'
  const cleanPath = url.startsWith('/') ? url : `/${url}`
  return `${backendBase}${cleanPath}`
}

export default getImageUrl
