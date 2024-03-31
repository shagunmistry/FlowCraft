import AuthenticationForm from '@/components/AuthenticationForm'
import {
  login,
  signup,
  loginWithGithub,
  loginWithGoogle,
} from '../login/actions'
import Navbar from '@/components/Navbar'

export default function SignUpPage() {
  return (
    <>
      <Navbar />
      <AuthenticationForm
        login={login}
        signUp={signup}
        loginWithGithub={loginWithGithub}
        loginWithGoogle={loginWithGoogle}
        isLoginOrSignup="signup"
      />
    </>
  )
}
