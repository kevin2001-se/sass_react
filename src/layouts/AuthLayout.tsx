import { Outlet } from "react-router-dom"

export function AuthLayout() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-slate-50">
      <div className="mx-auto grid min-h-screen w-full max-w-6xl place-items-center px-4 py-10">
        <Outlet />
      </div>
    </main>
  )
}
