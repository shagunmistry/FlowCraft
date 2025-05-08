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
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { cn } from '@/lib/utils'

// Decorative element component
const DecorativeElement = ({ className }: { className: string }) => (
  <motion.div
    className={cn(
      'absolute rounded-full bg-gradient-to-r from-fuchsia-300 to-indigo-300 opacity-70 blur-xl',
      className,
    )}
    animate={{
      scale: [1, 1.05, 1],
      opacity: [0.5, 0.7, 0.5],
    }}
    transition={{
      duration: 8,
      repeat: Infinity,
      repeatType: 'reverse',
    }}
  />
)

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

  const formVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
  }

  return (
    <>
      <div className="relative flex min-h-full flex-1 flex-col justify-center overflow-hidden bg-gradient-to-br from-fuchsia-50 via-purple-50 to-indigo-50 py-12 sm:px-6 lg:px-8">
        {/* Decorative elements */}
        <DecorativeElement className="-left-20 -top-20 h-64 w-64" />
        <DecorativeElement className="-right-32 top-1/4 h-80 w-80" />
        <DecorativeElement className="-bottom-40 left-1/4 h-72 w-72" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 sm:mx-auto sm:w-full sm:max-w-md"
        >
          <Link href="/">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="mx-auto h-20 w-20 overflow-hidden rounded-2xl shadow-lg"
            >
              <Image
                className="h-full w-full object-cover"
                src={FlowCraftLogo}
                alt="FlowCraft Logo"
                height={200}
                width={200}
                priority
              />
            </motion.div>
          </Link>
          <h2 className="mt-8 text-center font-serif text-4xl font-semibold tracking-tight text-gray-900">
            {isLoginOrSignup === 'login'
              ? 'Welcome back'
              : 'Create your account'}
          </h2>
          <p className="mt-2 text-center text-lg text-purple-700">
            {isLoginOrSignup === 'login'
              ? 'Sign in to transform your ideas into visual magic'
              : 'Join FlowCraft and bring your ideas to life'}
          </p>
        </motion.div>

        <div className="relative z-10 mt-8 sm:mx-auto sm:w-full sm:max-w-[480px]">
          <motion.div
            variants={formVariants}
            initial="hidden"
            animate="visible"
            className="mx-4 sm:mx-0"
          >
            <Card className="overflow-hidden rounded-2xl p-8 shadow-xl">
              <form className="space-y-6" onSubmit={handleSubmit}>
                <motion.div variants={itemVariants}>
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
                      className="block w-full rounded-xl border-0 bg-indigo-50/50 px-4 py-3 text-gray-900 shadow-sm ring-1 ring-inset ring-purple-200 transition-colors placeholder:text-gray-400 focus:bg-white focus:ring-2 focus:ring-inset focus:ring-fuchsia-500"
                      placeholder="Enter your email"
                    />
                  </div>
                </motion.div>

                <motion.div variants={itemVariants}>
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
                      className="block w-full rounded-xl border-0 bg-indigo-50/50 px-4 py-3 text-gray-900 shadow-sm ring-1 ring-inset ring-purple-200 transition-colors placeholder:text-gray-400 focus:bg-white focus:ring-2 focus:ring-inset focus:ring-fuchsia-500"
                      placeholder="Enter your password"
                    />
                  </div>
                </motion.div>

                <motion.div variants={itemVariants}>
                  <Button
                    type="submit"
                    className="relative w-full overflow-hidden rounded-xl bg-gradient-to-r from-fuchsia-600 via-purple-600 to-indigo-600 px-4 py-3 text-base font-medium text-white shadow-lg transition-all hover:shadow-xl"
                  >
                    <span className="relative z-10">
                      {isLoginOrSignup === 'login' ? 'Sign in' : 'Sign up'}
                    </span>
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-fuchsia-500 via-purple-500 to-indigo-500 opacity-0"
                      whileHover={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    />
                  </Button>
                </motion.div>
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
                        className="font-medium text-fuchsia-600 transition-colors hover:text-purple-500"
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
                        className="font-medium text-fuchsia-600 transition-colors hover:text-purple-500"
                      >
                        Sign in
                      </Link>
                    </p>
                  </div>
                )}

                <div className="relative mt-8">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-purple-100" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="bg-white px-4 text-gray-500">
                      Or continue with
                    </span>
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-2 gap-4">
                  <motion.button
                    whileHover={{ scale: 1.03, y: -2 }}
                    whileTap={{ scale: 0.97 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                    type="button"
                    onClick={_loginWithGoogle}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-medium text-gray-800 shadow-md ring-1 ring-inset ring-purple-100 transition-all hover:shadow-lg"
                  >
                    <GoogleSVG className="h-5 w-5" />
                    <span>Google</span>
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.03, y: -2 }}
                    whileTap={{ scale: 0.97 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                    type="button"
                    onClick={_loginWithGithub}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-medium text-gray-800 shadow-md ring-1 ring-inset ring-purple-100 transition-all hover:shadow-lg"
                  >
                    <GithubSVG className="h-5 w-5" />
                    <span>GitHub</span>
                  </motion.button>
                </div>
              </motion.div>
            </Card>
          </motion.div>
        </div>
      </div>
    </>
  )
}
