export function PosSearchEmpty({ query }: { query: string }) {
  return (
    <div className="rounded-md border border-dashed p-6 text-center text-sm text-muted-foreground">
      {query.trim().length < 2 ? "Escribe al menos 2 caracteres para buscar." : "No se encontraron productos con stock disponible."}
    </div>
  )
}

