'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import FlowCraftLogo from '@/images/FlowCraftLogo_New.png'
import Image from 'next/image'
import ErrorAlert from './ErrorAlert'
import { useState } from 'react'
import SuccessAlert from './SuccessAlert'
import { Provider } from '@supabase/supabase-js'
import GithubSVG from '@/lib/Shared/svgs/Github.svg'
import GoogleSVG from '@/lib/Shared/svgs/Google.svg'
import Button from '@/components/ui/Button'
import { cn } from '@/lib/utils'

export default function AuthenticationForm({
  login,
  signUp,
  loginWithGithub,
  loginWithGoogle,
  isLoginOrSignup,
}: {
  login: (formData: FormData) => Promise<{ error: string }>
  signUp: (
    formData: FormData,
  ) => Promise<
    | { error: string; success?: undefined }
    | { success: string; error?: undefined }
  >
  loginWithGithub: () => Promise<
    | { error: string; success?: undefined; data?: undefined }
    | {
        success: string
        data: { provider: Provider; url: string }
        error?: undefined
      }
  >
  loginWithGoogle: () => Promise<
    | { error: string; success?: undefined; data?: undefined }
    | {
        success: string
        data: { provider: Provider; url: string }
        error?: undefined
      }
  >
  isLoginOrSignup: 'login' | 'signup'
}) {
  const [showError, setShowError] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [showSuccess, setShowSuccess] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')

  const _login = async () => {
    const formData = new FormData()

    const emailField = document.getElementById('email') as HTMLInputElement
    const passwordField = document.getElementById(
      'password',
    ) as HTMLInputElement

    if (!emailField || !passwordField) return

    formData.append('email', emailField.value)
    formData.append('password', passwordField.value)

    const res = (await login(formData)) as any

    if (res === undefined) {
      window.location.href = '/dashboard'
    }

    if (res && res.error) {
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
    }
  }

  const _signup = async () => {
    const formData = new FormData()
    const emailField = document.getElementById('email') as HTMLInputElement
    const passwordField = document.getElementById(
      'password',
    ) as HTMLInputElement

    if (!emailField || !passwordField) return

    formData.append('email', emailField.value)
    formData.append('password', passwordField.value)

    const res = (await signUp(formData)) as any

    if (res.error) {
      setErrorMessage(res.error)
      setShowError(true)
      setTimeout(() => {
        setShowError(false)
        setErrorMessage('')
      }, 5000)
    }

    if (res.success) {
      setSuccessMessage(res.success)
      setShowSuccess(true)
      emailField.value = ''
      passwordField.value = ''
      setTimeout(() => {
        setShowSuccess(false)
        setSuccessMessage('')
      }, 5000)
    }
  }

  const _loginWithGithub = async () => {
    const res = await loginWithGithub()
    if (res && res.error) {
      setErrorMessage('Error during login')
      setShowError(true)
      setTimeout(() => {
        setShowError(false)
        setErrorMessage('')
      }, 5000)
    }
    if (res && res.data) window.location.href = res.data.url
  }

  const _loginWithGoogle = async () => {
    const res = await loginWithGoogle()
    if (res && res.error) {
      setErrorMessage('Error during login')
      setShowError(true)
      setTimeout(() => {
        setShowError(false)
        setErrorMessage('')
      }, 5000)
    }
    if (res && res.data) window.location.href = res.data.url
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
                className="flex w-full justify-center rounded-lg bg-gray-900 px-3 py-2.5 text-sm font-semibold leading-6 text-white shadow-sm transition-all duration-200 hover:bg-gray-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-900"
              >
                {isLoginOrSignup === 'login' ? 'Sign in' : 'Create account'}
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
              className="flex w-full items-center justify-center gap-3 rounded-lg bg-white px-3 py-2.5 text-sm font-medium text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 transition-all hover:bg-gray-50"
            >
              <GoogleSVG className="h-5 w-5" />
              <span>Google</span>
            </button>

            <button
              type="button"
              onClick={_loginWithGithub}
              className="flex w-full items-center justify-center gap-3 rounded-lg bg-white px-3 py-2.5 text-sm font-medium text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 transition-all hover:bg-gray-50"
            >
              <GithubSVG className="h-5 w-5" />
              <span>GitHub</span>
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
