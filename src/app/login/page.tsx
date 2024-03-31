import AuthenticationForm from '@/components/AuthenticationForm'
import { login, signup, loginWithGithub, loginWithGoogle } from './actions'
import Navbar from '@/components/Navbar'
import { Footer } from '@/components/Footer'

export default function LoginPage() {
  return (
    <>
      <Navbar />
      <AuthenticationForm
        login={login}
        signUp={signup}
        loginWithGithub={loginWithGithub}
        loginWithGoogle={loginWithGoogle}
        isLoginOrSignup="login"
      />
    </>
  )
}
