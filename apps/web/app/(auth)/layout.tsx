const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex items-center justify-center min-h-screen min-w-screen flex-col">
      {children}
    </div>
  )
}

export default AuthLayout
