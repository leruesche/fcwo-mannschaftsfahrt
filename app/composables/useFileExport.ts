export function useFileExport() {
  const toast = useToast()

  function downloadFile(content: string, filename: string, mimeType: string) {
    const blob = new Blob([content], { type: `${mimeType};charset=utf-8;` })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', filename)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  function exportCSV(csvContent: string, baseFilename = 'export') {
    const filename = `${baseFilename}-${new Date().toISOString().split('T')[0]}.csv`
    downloadFile(csvContent, filename, 'text/csv')
    toast.add({
      title: 'CSV exportiert',
      icon: 'i-lucide-check',
      color: 'success',
    })
  }

  function exportJSON(jsonContent: string, baseFilename = 'export') {
    const filename = `${baseFilename}-${new Date().toISOString().split('T')[0]}.json`
    downloadFile(jsonContent, filename, 'application/json')
    toast.add({
      title: 'JSON exportiert',
      icon: 'i-lucide-check',
      color: 'success',
    })
  }

  function importJSON(
    file: File,
    onSuccess: (content: string) => boolean,
  ): Promise<void> {
    return new Promise((resolve) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        const content = e.target?.result as string
        const success = onSuccess(content)

        if (success) {
          toast.add({
            title: 'Daten erfolgreich importiert',
            icon: 'i-lucide-check',
            color: 'success',
          })
        }
        else {
          toast.add({
            title: 'Fehler beim Importieren',
            description: 'Bitte stelle sicher, dass es eine gültige JSON-Datei ist.',
            icon: 'i-lucide-alert-circle',
            color: 'error',
          })
        }
        resolve()
      }
      reader.onerror = () => {
        toast.add({
          title: 'Fehler beim Lesen der Datei',
          icon: 'i-lucide-alert-circle',
          color: 'error',
        })
        resolve()
      }
      reader.readAsText(file)
    })
  }

  return {
    exportCSV,
    exportJSON,
    importJSON,
  }
}
