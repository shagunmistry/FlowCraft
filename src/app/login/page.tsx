import LoginPageComponent from '@/components/LoginPage'
import { login, signup } from './actions'

export default function LoginPage() {
  return <LoginPageComponent login={login} signUp={signup} />
}
