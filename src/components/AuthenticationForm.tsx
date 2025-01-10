'use client'

import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import FlowCraftLogo from '@/images/FlowCraftLogo_New.png'
import Image from 'next/image'
import ErrorAlert from './ErrorAlert'
import { useState } from 'react'
import SuccessAlert from './SuccessAlert'
import { Provider } from '@supabase/supabase-js'
import GithubSVG from '@/lib/Shared/svgs/Github.svg'
import GoogleSVG from '@/lib/Shared/svgs/Google.svg'
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

    if (!emailField || !passwordField) {
      return
    }

    formData.append('email', emailField.value)
    formData.append('password', passwordField.value)

    const res = (await login(formData)) as any

    console.log('res', res)

    if (res === undefined) {
      window.location.href = '/dashboard'
    }

    if (res && res.error) {
      console.log('res.error', res.error)
      setErrorMessage('Username or password is incorrect.')
      setShowError(true)
      // Clear the error message after 5 seconds
      setTimeout(() => {
        setShowError(false)
        setErrorMessage('')
      }, 5000)

      const passwordField = document.getElementById(
        'password',
      ) as HTMLInputElement
      if (passwordField) {
        passwordField.value = ''
        passwordField.focus()
      }
    }
  }

  const _signup = async () => {
    const formData = new FormData()

    // get the email and password from the form
    const emailField = document.getElementById('email') as HTMLInputElement
    const passwordField = document.getElementById(
      'password',
    ) as HTMLInputElement

    if (!emailField || !passwordField) {
      return
    }

    formData.append('email', emailField.value)
    formData.append('password', passwordField.value)

    const res = (await signUp(formData)) as any

    console.log('Sign up res', res)

    if (res.error) {
      console.log('res.error', res.error)
      setErrorMessage(res.error)
      setShowError(true)
      // Clear the error message after 5 seconds
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
      console.log('res.error', res.error)
      setErrorMessage('Error during login')
      setShowError(true)
      // Clear the error message after 5 seconds
      setTimeout(() => {
        setShowError(false)
        setErrorMessage('')
      }, 5000)
    }

    if (res && res.data) {
      window.location.href = res.data.url
    }
  }

  const _loginWithGoogle = async () => {
    const res = await loginWithGoogle()

    if (res && res.error) {
      console.log('res.error', res.error)
      setErrorMessage('Error during login')
      setShowError(true)
      // Clear the error message after 5 seconds
      setTimeout(() => {
        setShowError(false)
        setErrorMessage('')
      }, 5000)
    }

    if (res && res.data) {
      console.log('Redirecting to: ', res.data.url)
      window.location.href = res.data.url
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
    <>
      <div className="flex min-h-full flex-1 flex-col justify-center bg-gradient-to-b from-gray-50 to-white py-12 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="sm:mx-auto sm:w-full sm:max-w-md"
        >
          <Link href="/">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Image
                className="mx-auto h-16 w-auto rounded-2xl shadow-lg transition-all duration-300"
                src={FlowCraftLogo}
                alt="FlowCraft Logo"
                height={200}
                width={200}
                priority
              />
            </motion.div>
          </Link>
          <h2 className="mt-8 text-center text-3xl font-semibold tracking-tight text-gray-900">
            {isLoginOrSignup === 'login'
              ? 'Welcome back'
              : 'Create your account'}
          </h2>
        </motion.div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-[480px]">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mx-4 overflow-hidden rounded-2xl bg-white p-8 shadow-lg ring-1 ring-gray-900/5 sm:mx-0"
          >
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Email address
                </label>
                <div className="mt-2">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="block w-full rounded-lg border-0 bg-gray-50 px-4 py-2.5 text-gray-900 ring-1 ring-inset ring-gray-300 transition-colors placeholder:text-gray-400 focus:bg-white focus:ring-2 focus:ring-blue-600"
                    placeholder="Enter your email"
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
                    autoComplete="current-password"
                    required
                    className="block w-full rounded-lg border-0 bg-gray-50 px-4 py-2.5 text-gray-900 ring-1 ring-inset ring-gray-300 transition-colors placeholder:text-gray-400 focus:bg-white focus:ring-2 focus:ring-blue-600"
                    placeholder="Enter your password"
                  />
                </div>
              </div>

              <div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="relative w-full rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-medium text-white shadow-lg transition-all hover:bg-gray-800"
                >
                  {isLoginOrSignup === 'login' ? 'Sign in' : 'Sign up'}
                </motion.button>
              </div>
            </form>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <ErrorAlert message={errorMessage} show={showError} />
              <SuccessAlert
                message={successMessage}
                show={showSuccess}
                setShow={setShowSuccess}
              />

              {isLoginOrSignup === 'login' ? (
                <div className="mt-6 text-center">
                  <p className="text-sm text-gray-600">
                    Don't have an account?{' '}
                    <Link
                      href="/sign-up"
                      className="font-medium text-blue-600 hover:text-blue-500"
                    >
                      Sign up
                    </Link>
                  </p>
                </div>
              ) : (
                <div className="mt-6 text-center">
                  <p className="text-sm text-gray-600">
                    Already have an account?{' '}
                    <Link
                      href="/login"
                      className="font-medium text-blue-600 hover:text-blue-500"
                    >
                      Sign in
                    </Link>
                  </p>
                </div>
              )}

              <div className="relative mt-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="bg-white px-2 text-gray-500">
                    Or continue with
                  </span>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  onClick={_loginWithGoogle}
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-white px-4 py-2.5 text-sm font-medium text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                >
                  <GoogleSVG className="h-5 w-5" />
                  <span>Google</span>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  onClick={_loginWithGithub}
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-white px-4 py-2.5 text-sm font-medium text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                >
                  <GithubSVG className="h-5 w-5" />
                  <span>GitHub</span>
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </>
  )
}
