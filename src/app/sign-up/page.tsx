import AuthenticationForm from '@/components/AuthenticationForm'
import PageWithNavbar from '@/components/PageWithNavbar'

export default function SignUpPage() {
  return (
    <PageWithNavbar>
      <AuthenticationForm isLoginOrSignup="signup" />
    </PageWithNavbar>
  )
}
