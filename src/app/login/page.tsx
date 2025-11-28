import AuthenticationForm from '@/components/AuthenticationForm'
import PageWithNavbar from '@/components/PageWithNavbar'

export default function LoginPage() {
  return (
    <PageWithNavbar>
      <AuthenticationForm isLoginOrSignup="login" />
    </PageWithNavbar>
  )
}
