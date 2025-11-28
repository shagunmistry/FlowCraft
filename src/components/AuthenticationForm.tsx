'use client'

import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import FlowCraftLogo from '@/images/FlowCraftLogo_New.png'
import Image from 'next/image'
import ErrorAlert from './ErrorAlert'
import { useState } from 'react'
import SuccessAlert from './SuccessAlert'
import GithubSVG from '@/lib/Shared/svgs/Github.svg'
import GoogleSVG from '@/lib/Shared/svgs/Google.svg'
import Button from '@/components/ui/Button'
import { useRouter } from 'next/navigation'

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
        // Successful login - redirect to dashboard
        router.push('/dashboard')
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

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-white px-4 py-12 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-[400px] space-y-8"
      >
        {/* Header Section */}
        <div className="flex flex-col items-center text-center">
          <Link href="/" className="mb-6">
            <div className="h-16 w-16 overflow-hidden rounded-xl shadow-sm transition-transform hover:scale-105">
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
          <h1 className="text-2xl font-semibold tracking-tight text-gray-900">
            {isLoginOrSignup === 'login' ? 'Welcome back' : 'Create account'}
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            {isLoginOrSignup === 'login'
              ? 'Enter your details to access your workspace.'
              : 'Start visualizing your ideas today.'}
          </p>
        </div>

        {/* Main Form */}
        <div className="mt-10">
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium leading-6 text-gray-900"
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
                  className="block w-full rounded-lg border-0 py-2.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-600 sm:text-sm sm:leading-6"
                  placeholder="name@example.com"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium leading-6 text-gray-900"
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
                  className="block w-full rounded-lg border-0 py-2.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-600 sm:text-sm sm:leading-6"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="pt-2">
              <Button
                type="submit"
                disabled={isLoading}
                className="flex w-full justify-center rounded-lg bg-gray-900 px-3 py-2.5 text-sm font-semibold leading-6 text-white shadow-sm transition-all duration-200 hover:bg-gray-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-900 disabled:opacity-60 disabled:cursor-not-allowed"
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
                    >
                      {isLoginOrSignup === 'login' ? 'Sign in' : 'Create account'}
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
          <p className="mt-6 text-center text-sm text-gray-500">
            {isLoginOrSignup === 'login' ? (
              <>
                Not a member?{' '}
                <Link
                  href="/sign-up"
                  className="font-medium text-gray-900 hover:underline"
                >
                  Sign up now
                </Link>
              </>
            ) : (
              <>
                Already have an account?{' '}
                <Link
                  href="/login"
                  className="font-medium text-gray-900 hover:underline"
                >
                  Sign in
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
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-sm font-medium leading-6">
              <span className="bg-white px-4 text-gray-500">
                Or continue with
              </span>
            </div>
          </div>

          {/* Social Buttons */}
          <div className="mt-6 grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={_loginWithGoogle}
              disabled={isLoading}
              className="flex w-full items-center justify-center gap-3 rounded-lg bg-white px-3 py-2.5 text-sm font-medium text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 transition-all hover:bg-gray-50 disabled:opacity-60 disabled:cursor-not-allowed"
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
              className="flex w-full items-center justify-center gap-3 rounded-lg bg-white px-3 py-2.5 text-sm font-medium text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 transition-all hover:bg-gray-50 disabled:opacity-60 disabled:cursor-not-allowed"
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
      </motion.div>
    </div>
  )
}
