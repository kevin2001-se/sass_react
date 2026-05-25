import { z } from "zod"
export const roleSchema = z.object({ name: z.string().min(1, "El nombre es obligatorio"), description: z.string().optional(), active: z.boolean(), permissions: z.array(z.number()) })
export type RoleSchemaValues = z.infer<typeof roleSchema>