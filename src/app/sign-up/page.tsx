import AuthenticationForm from '@/components/AuthenticationForm'
import {
  login,
  signup,
  loginWithGithub,
  loginWithGoogle,
} from '../login/actions'

export default function SignUpPage() {
  return (
    <AuthenticationForm
      login={login}
      signUp={signup}
      loginWithGithub={loginWithGithub}
      loginWithGoogle={loginWithGoogle}
      isLoginOrSignup="signup"
    />
  )
}
