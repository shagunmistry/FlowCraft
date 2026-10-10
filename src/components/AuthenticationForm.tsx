'use client'

import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import FlowCraftLogo from '@/images/FlowCraftLogo_New.png'
import Image from 'next/image'
import ErrorAlert from './ErrorAlert'
import { useEffect, useState } from 'react'
import SuccessAlert from './SuccessAlert'
import GithubSVG from '@/lib/Shared/svgs/Github.svg'
import GoogleSVG from '@/lib/Shared/svgs/Google.svg'
import Button from '@/components/ui/Button'
import { useRouter } from 'next/navigation'
import { trackTryIt } from '@/lib/free-taste/track'

export default function AuthenticationForm({
  isLoginOrSignup,
}: {
  isLoginOrSignup: 'login' | 'signup'
}) {
  const router = useRouter()
  const [showError, setShowError] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [showSuccess, setShowSuccess] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [loadingType, setLoadingType] = useState<
    'email' | 'google' | 'github' | null
  >(null)
  const [templateId, setTemplateId] = useState<string | null>(null)
  const [signupSource, setSignupSource] = useState<string>('direct')

  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search)
      const t = params.get('template')
      if (t) setTemplateId(t)
      const src = params.get('src')
      if (src && /^[a-z0-9-]{1,32}$/.test(src)) setSignupSource(src)
    } catch {
      // ignore
    }
  }, [])

  const _login = async () => {
    const emailField = document.getElementById('email') as HTMLInputElement
    const passwordField = document.getElementById(
      'password',
    ) as HTMLInputElement

    if (!emailField || !passwordField) return

    setIsLoading(true)
    setLoadingType('email')

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: emailField.value,
          password: passwordField.value,
          templateId,
        }),
      })

      const data = await response.json()

      if (!response.ok || data.error) {
        setErrorMessage('Username or password is incorrect.')
        setShowError(true)
        setTimeout(() => {
          setShowError(false)
          setErrorMessage('')
        }, 5000)

        if (passwordField) {
          passwordField.value = ''
          passwordField.focus()
        }
      } else {
        const dest = data.diagramId
          ? `/dashboard/diagram/${data.diagramId}`
          : '/dashboard'
        router.push(dest)
        router.refresh()
      }
    } catch (error) {
      console.error('Login error:', error)
      setErrorMessage('An error occurred during login.')
      setShowError(true)
      setTimeout(() => {
        setShowError(false)
        setErrorMessage('')
      }, 5000)
    } finally {
      setIsLoading(false)
      setLoadingType(null)
    }
  }

  const _signup = async () => {
    const emailField = document.getElementById('email') as HTMLInputElement
    const passwordField = document.getElementById(
      'password',
    ) as HTMLInputElement

    if (!emailField || !passwordField) return

    setIsLoading(true)
    setLoadingType('email')

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: emailField.value,
          password: passwordField.value,
        }),
      })

      const data = await response.json()

      if (data.error) {
        setErrorMessage(data.error)
        setShowError(true)
        setTimeout(() => {
          setShowError(false)
          setErrorMessage('')
        }, 5000)
      }

      if (data.success) {
        trackTryIt('signup_completed', { source: signupSource })
        setSuccessMessage(data.success)
        setShowSuccess(true)
        emailField.value = ''
        passwordField.value = ''
        setTimeout(() => {
          setShowSuccess(false)
          setSuccessMessage('')
        }, 5000)
      }
    } catch (error) {
      console.error('Signup error:', error)
      setErrorMessage('An error occurred during signup.')
      setShowError(true)
      setTimeout(() => {
        setShowError(false)
        setErrorMessage('')
      }, 5000)
    } finally {
      setIsLoading(false)
      setLoadingType(null)
    }
  }

  const _loginWithGithub = async () => {
    setIsLoading(true)
    setLoadingType('github')

    try {
      const response = await fetch('/api/auth/github', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ templateId }),
      })

      const data = await response.json()

      if (data.error) {
        setErrorMessage('Error during login')
        setShowError(true)
        setTimeout(() => {
          setShowError(false)
          setErrorMessage('')
        }, 5000)
        setIsLoading(false)
        setLoadingType(null)
      } else if (data.url) {
        window.location.href = data.url
      }
    } catch (error) {
      console.error('GitHub login error:', error)
      setErrorMessage('An error occurred during GitHub login.')
      setShowError(true)
      setTimeout(() => {
        setShowError(false)
        setErrorMessage('')
      }, 5000)
      setIsLoading(false)
      setLoadingType(null)
    }
  }

  const _loginWithGoogle = async () => {
    setIsLoading(true)
    setLoadingType('google')

    try {
      const response = await fetch('/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ templateId }),
      })

      const data = await response.json()

      if (data.error) {
        setErrorMessage('Error during login')
        setShowError(true)
        setTimeout(() => {
          setShowError(false)
          setErrorMessage('')
        }, 5000)
        setIsLoading(false)
        setLoadingType(null)
      } else if (data.url) {
        window.location.href = data.url
      }
    } catch (error) {
      console.error('Google login error:', error)
      setErrorMessage('An error occurred during Google login.')
      setShowError(true)
      setTimeout(() => {
        setShowError(false)
        setErrorMessage('')
      }, 5000)
      setIsLoading(false)
      setLoadingType(null)
    }
  }

  const handleSubmit = (e: any) => {
    e.preventDefault()
    if (isLoginOrSignup === 'login') {
      _login()
    } else {
      _signup()
    }
  }

  const pageLabel = isLoginOrSignup === 'login' ? 'Sheet · 01 · Access' : 'Sheet · 02 · Enroll'

  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-ink px-4 py-12 sm:px-6 lg:px-8">
      {/* dot grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            'radial-gradient(rgba(196,255,61,0.1) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }}
      />
      {/* corner crosshairs */}
      <div className="pointer-events-none absolute left-6 top-6 hidden font-mono text-[10px] uppercase tracking-[0.25em] text-fog md:block">
        <span className="text-signal">◆</span> flowcraft / auth
      </div>
      <div className="pointer-events-none absolute right-6 top-6 hidden font-mono text-[10px] uppercase tracking-[0.25em] text-fog md:block">
        N 40°42′ · W 74°00′ · v.2026
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full max-w-[440px]"
      >
        <div className="relative overflow-hidden rounded-sm border border-rule bg-graphite shadow-2xl shadow-black/40">
          {/* top strip */}
          <div className="flex items-center justify-between border-b border-rule px-5 py-2.5 font-mono text-[10px] uppercase tracking-[0.22em] text-fog">
            <span>{pageLabel}</span>
            <span className="flex items-center gap-1.5">
              <span className="inline-flex h-1.5 w-1.5 rounded-full bg-signal animate-tick" />
              <span className="text-signal">●</span>
            </span>
          </div>

          <div className="px-6 py-8 sm:px-10 sm:py-10">
            {/* Header Section */}
            <div className="flex flex-col items-center text-center">
              <Link href="/" className="mb-6">
                <div className="relative h-14 w-14 overflow-hidden rounded-sm border border-rule bg-ink p-1 transition-transform hover:scale-105">
                  <Image
                    className="h-full w-full object-cover"
                    src={FlowCraftLogo}
                    alt="FlowCraft Logo"
                    height={100}
                    width={100}
                    priority
                  />
                </div>
              </Link>
              <h1 className="font-serif text-3xl leading-tight text-paper">
                {isLoginOrSignup === 'login' ? (
                  <>
                    Welcome <span className="italic text-signal">back</span>
                  </>
                ) : (
                  <>
                    Begin a new <span className="italic text-signal">draft</span>
                  </>
                )}
              </h1>
              <p className="mt-2 max-w-sm text-sm leading-6 text-paper/60">
                {isLoginOrSignup === 'login'
                  ? 'Enter your credentials to access your workspace.'
                  : 'Start visualizing your ideas — the canvas awaits.'}
              </p>
            </div>

            {/* Main Form */}
            <div className="mt-8">
              <form className="space-y-5" onSubmit={handleSubmit}>
                <div>
                  <label
                    htmlFor="email"
                    className="block font-mono text-[10px] uppercase tracking-[0.22em] text-fog"
                  >
                    Email
                  </label>
                  <div className="mt-2">
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      className="block w-full rounded-sm border border-rule bg-ink/60 px-3 py-2.5 text-sm text-paper placeholder:text-fog/70 focus:border-signal/50 focus:outline-none focus:ring-0"
                      placeholder="name@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="block font-mono text-[10px] uppercase tracking-[0.22em] text-fog"
                  >
                    Password
                  </label>
                  <div className="mt-2">
                    <input
                      id="password"
                      name="password"
                      type="password"
                      autoComplete={
                        isLoginOrSignup === 'login'
                          ? 'current-password'
                          : 'new-password'
                      }
                      required
                      className="block w-full rounded-sm border border-rule bg-ink/60 px-3 py-2.5 text-sm text-paper placeholder:text-fog/70 focus:border-signal/50 focus:outline-none focus:ring-0"
                      placeholder="••••••••"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="group relative flex w-full items-center justify-center overflow-hidden rounded-sm bg-signal px-4 py-2.5 font-mono text-[11px] uppercase tracking-[0.2em] text-ink transition-colors hover:bg-paper disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                <AnimatePresence mode="wait">
                  {isLoading && loadingType === 'email' ? (
                    <motion.div
                      key="loading"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="flex items-center gap-2"
                    >
                      <svg
                        className="h-4 w-4 animate-spin"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      <span>
                        {isLoginOrSignup === 'login'
                          ? 'Signing in...'
                          : 'Creating account...'}
                      </span>
                    </motion.div>
                  ) : (
                    <motion.span
                      key="text"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="inline-flex items-center gap-2"
                    >
                      <span>
                        {isLoginOrSignup === 'login'
                          ? 'Sign in'
                          : 'Create account'}
                      </span>
                      <span className="transition-transform duration-200 group-hover:translate-x-1">
                        →
                      </span>
                    </motion.span>
                  )}
                </AnimatePresence>
              </Button>
            </div>
          </form>

          {/* Feedback Alerts */}
          <div className="mt-4 space-y-2">
            <ErrorAlert message={errorMessage} show={showError} />
            <SuccessAlert
              message={successMessage}
              show={showSuccess}
              setShow={setShowSuccess}
            />
          </div>

          {/* Toggle Login/Signup */}
          <p className="mt-6 text-center font-mono text-[11px] uppercase tracking-[0.2em] text-fog">
            {isLoginOrSignup === 'login' ? (
              <>
                Not a member?{' '}
                <Link
                  href={
                    templateId ? `/sign-up?template=${templateId}` : '/sign-up'
                  }
                  className="text-signal transition-colors hover:text-paper"
                >
                  Sign up →
                </Link>
              </>
            ) : (
              <>
                Already a member?{' '}
                <Link
                  href={templateId ? `/login?template=${templateId}` : '/login'}
                  className="text-signal transition-colors hover:text-paper"
                >
                  Sign in →
                </Link>
              </>
            )}
          </p>

          {/* Divider */}
          <div className="relative mt-8">
            <div
              className="absolute inset-0 flex items-center"
              aria-hidden="true"
            >
              <div className="w-full border-t border-rule" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-graphite px-4 font-mono text-[10px] uppercase tracking-[0.25em] text-fog">
                Or continue with
              </span>
            </div>
          </div>

          {/* Social Buttons */}
          <div className="mt-6 grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={_loginWithGoogle}
              disabled={isLoading}
              className="flex w-full items-center justify-center gap-3 rounded-sm border border-rule bg-ink/60 px-3 py-2.5 font-mono text-[11px] uppercase tracking-[0.2em] text-paper/80 transition-all hover:border-signal/40 hover:text-paper disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <AnimatePresence mode="wait">
                {isLoading && loadingType === 'google' ? (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="flex items-center gap-2"
                  >
                    <svg
                      className="h-4 w-4 animate-spin"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                  </motion.div>
                ) : (
                  <motion.div
                    key="content"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="flex items-center gap-3"
                  >
                    <GoogleSVG className="h-5 w-5" />
                    <span>Google</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </button>

            <button
              type="button"
              onClick={_loginWithGithub}
              disabled={isLoading}
              className="flex w-full items-center justify-center gap-3 rounded-sm border border-rule bg-ink/60 px-3 py-2.5 font-mono text-[11px] uppercase tracking-[0.2em] text-paper/80 transition-all hover:border-signal/40 hover:text-paper disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <AnimatePresence mode="wait">
                {isLoading && loadingType === 'github' ? (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="flex items-center gap-2"
                  >
                    <svg
                      className="h-4 w-4 animate-spin"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                  </motion.div>
                ) : (
                  <motion.div
                    key="content"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="flex items-center gap-3"
                  >
                    <GithubSVG className="h-5 w-5" />
                    <span>GitHub</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
          </div>
        </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
