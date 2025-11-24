import AuthenticationForm from '@/components/AuthenticationForm'
import { login, signup, loginWithGithub, loginWithGoogle } from './actions'
import PageWithNavbar from '@/components/PageWithNavbar'
import Footer from '@/components/Footer'

export default function LoginPage() {
  return (
    <PageWithNavbar>
      <AuthenticationForm
        login={login}
        signUp={signup}
        loginWithGithub={loginWithGithub}
        loginWithGoogle={loginWithGoogle}
        isLoginOrSignup="login"
      />
    </PageWithNavbar>
  )
}
