import LoginPageComponent from '@/components/LoginPage'
import { login, signup, loginWithGithub, loginWithGoogle } from './actions'

export default function LoginPage() {
  return (
    <LoginPageComponent
      login={login}
      signUp={signup}
      loginWithGithub={loginWithGithub}
      loginWithGoogle={loginWithGoogle}
    />
  )
}
