import AuthenticationForm from '@/components/AuthenticationForm'
import {
  login,
  signup,
  loginWithGithub,
  loginWithGoogle,
} from '../login/actions'
import PageWithNavbar from '@/components/PageWithNavbar'

export default function SignUpPage() {
  return (
    <PageWithNavbar>
      <AuthenticationForm
        login={login}
        signUp={signup}
        loginWithGithub={loginWithGithub}
        loginWithGoogle={loginWithGoogle}
        isLoginOrSignup="signup"
      />
    </PageWithNavbar>
  )
}
