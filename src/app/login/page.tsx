import AuthenticationForm from '@/components/AuthenticationForm'
import { login, signup, loginWithGithub, loginWithGoogle } from './actions'

export default function LoginPage() {
  return (
    <AuthenticationForm
      login={login}
      signUp={signup}
      loginWithGithub={loginWithGithub}
      loginWithGoogle={loginWithGoogle}
      isLoginOrSignup="login"
    />
  )
}
