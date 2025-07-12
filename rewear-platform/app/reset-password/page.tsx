// app/reset-password/page.tsx

import { Suspense } from "react"
import ResetPasswordPageClient from "./ResetPasswordPageClient"

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center">Loading...</div>}>
      <ResetPasswordPageClient />
    </Suspense>
  )
}
