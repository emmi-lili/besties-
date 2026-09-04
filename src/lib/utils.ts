import { cn as cnMerge } from "cn"

/** Re-export tipado para imports `@/lib/utils` (páginas y componentes). */
export function cn(...inputs: Parameters<typeof cnMerge>): string {
  return cnMerge(...inputs)
}
