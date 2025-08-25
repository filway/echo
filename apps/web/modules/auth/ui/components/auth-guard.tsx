'use client'

import { Authenticated, Unauthenticated, AuthLoading } from 'convex/react'
import { AuthLayout } from '../layouts/auth-layout'
import { SingInView } from '../views/sign-in-view'

export const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <AuthLoading>
        <AuthLayout>
          <p>Loading...</p>
        </AuthLayout>
      </AuthLoading>
      <Authenticated>{children}</Authenticated>
      <Unauthenticated>
        <AuthLayout>
          <SingInView />
        </AuthLayout>
      </Unauthenticated>
    </>
  )
}
