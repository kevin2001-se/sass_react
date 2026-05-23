export function downloadBlob(blob: Blob, filename: string) {
  const url = window.URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  link.remove()
  window.URL.revokeObjectURL(url)
}

export function openBlob(blob: Blob) {
  const url = window.URL.createObjectURL(blob)
  const popup = window.open(url, "_blank", "noopener,noreferrer")
  window.setTimeout(() => window.URL.revokeObjectURL(url), 20_000)
  return Boolean(popup)
}

export function openPrintableBlob(blob: Blob) {
  const url = window.URL.createObjectURL(blob)
  const popup = window.open(url, "_blank", "noopener,noreferrer")
  window.setTimeout(() => window.URL.revokeObjectURL(url), 20_000)

  if (!popup) return false

  popup.addEventListener("load", () => {
    try {
      popup.focus()
      popup.print()
    } catch {
      // El navegador puede bloquear print; dejamos el documento abierto.
    }
  })

  return true
}