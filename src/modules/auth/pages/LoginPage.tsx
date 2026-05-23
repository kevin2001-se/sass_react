import { zodResolver } from "@hookform/resolvers/zod"
import { ArrowRight, ShieldCheck } from "lucide-react"
import { useForm } from "react-hook-form"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"
import { z } from "zod"

import { useLogin } from "@/modules/auth/hooks/use-auth"
import { useSeleccionarTienda } from "@/modules/auth/hooks/use-tiendas"
import { Alert, AlertDescription } from "@/shared/components/ui/alert"
import { Button } from "@/shared/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/components/ui/form"
import { Input } from "@/shared/components/ui/input"
import {
  getLaravelErrorMessage,
  getLaravelValidationErrors,
} from "@/shared/services/api"
import { useAuthStore } from "@/shared/stores/auth.store"

const loginSchema = z.object({
  email: z.string().min(1, "El correo es obligatorio").email("Ingresa un correo válido"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
})

type LoginFormValues = z.infer<typeof loginSchema>

export function LoginPage() {
  const navigate = useNavigate()
  const loginMutation = useLogin()
  const seleccionarTiendaMutation = useSeleccionarTienda()
  const setSessionFromApi = useAuthStore((state) => state.setSessionFromApi)
  const setTiendaActiva = useAuthStore((state) => state.setTiendaActiva)

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  async function onSubmit(values: LoginFormValues) {
    try {
      const session = await loginMutation.mutateAsync(values)
      setSessionFromApi(session)

      if (session.tienda_activa) {
        toast.success("Bienvenido al sistema.")
        navigate("/dashboard", { replace: true })
        return
      }

      if (session.tiendas_disponibles.length === 1) {
        const tienda = session.tiendas_disponibles[0]
        const response = await seleccionarTiendaMutation.mutateAsync(tienda.id)

        if ("user" in response) {
          setSessionFromApi({
            ...response,
            token: session.token,
          })
        } else {
          setTiendaActiva(response.tienda_activa)
        }

        toast.success("Tienda seleccionada automáticamente.")
        navigate("/dashboard", { replace: true })
        return
      }

      navigate("/seleccionar-tienda", { replace: true })
    } catch (error) {
      const validationErrors = getLaravelValidationErrors(error)

      Object.entries(validationErrors).forEach(([field, messages]) => {
        form.setError(field as keyof LoginFormValues, {
          type: "server",
          message: messages[0],
        })
      })

      toast.error(getLaravelErrorMessage(error, "No se pudo iniciar sesión."))
    }
  }

  const errorMessage = loginMutation.error
    ? getLaravelErrorMessage(loginMutation.error, "No se pudo iniciar sesión.")
    : null

  return (
    <Card className="w-full border-border/80 shadow-sm">
      <CardHeader className="space-y-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <ShieldCheck className="h-5 w-5" />
        </div>
        <div>
          <CardTitle className="text-2xl">Ingresar al sistema</CardTitle>
          <CardDescription>Accede al panel de tu botica o farmacia.</CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
            {errorMessage && (
              <Alert variant="destructive">
                <AlertDescription>{errorMessage}</AlertDescription>
              </Alert>
            )}

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Correo</FormLabel>
                  <FormControl>
                    <Input
                      autoComplete="email"
                      placeholder="admin@demo.com"
                      type="email"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contraseña</FormLabel>
                  <FormControl>
                    <Input
                      autoComplete="current-password"
                      placeholder="••••••••"
                      type="password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              className="w-full"
              disabled={loginMutation.isPending || seleccionarTiendaMutation.isPending}
              type="submit"
            >
              {loginMutation.isPending ? "Ingresando..." : "Entrar"}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
