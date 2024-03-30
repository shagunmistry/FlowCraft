'use client'

import Link from 'next/link'
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
      <div className="flex min-h-full flex-1 flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <Link href="/">
            <Image
              className="mx-auto rounded-lg shadow-2xl hover:shadow-lg transition-all duration-200 ease-in-out"
              src={FlowCraftLogo}
              alt="FlowCraft Logo"
              height={200}
              width={200}
            />
          </Link>
          <h2 className="mt-6 text-center text-2xl font-bold leading-9 tracking-tight text-pink-500">
            {isLoginOrSignup === 'login' ? 'Sign in to' : 'Sign up for'}{' '}
            <Link href="/" className="text-indigo-500">
              FlowCraft
            </Link>
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-[480px]">
          <div
            className={cn(
              'px-6 py-12 shadow sm:rounded-lg sm:px-12',
              isLoginOrSignup === 'login'
                ? 'bg-gradient-to-br from-indigo-500 to-pink-600'
                : 'bg-gradient-to-br from-pink-500 to-indigo-600',
            )}
          >
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium leading-6 text-white"
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
                    className="block w-full rounded-md border-0 py-1.5 text-pink-500 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium leading-6 text-white"
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
                    className="block w-full rounded-md border-0 py-1.5 text-pink-400 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              {/* <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 text-white focus:ring-indigo-600"
                  />
                  <label
                    htmlFor="remember-me"
                    className="ml-3 block text-sm leading-6 text-gray-900"
                  >
                    Remember me?
                  </label>
                </div>

                <div className="text-sm leading-6">
                  <a
                    href="#"
                    className="font-semibold text-white hover:text-indigo-500"
                  >
                    Forgot password?
                  </a>
                </div>
              </div> */}

              <div className="flex justify-between">
                <button
                  type="submit"
                  className={cn(
                    'ml-2 flex-1 justify-center rounded-md px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2',
                    isLoginOrSignup === 'login'
                      ? 'bg-indigo-600 hover:bg-indigo-500'
                      : 'bg-pink-600 hover:bg-pink-500',
                  )}
                >
                  {isLoginOrSignup === 'login' ? 'Sign in' : 'Sign up'}
                </button>
              </div>
            </form>
            <br />

            <ErrorAlert message={errorMessage} show={showError} />
            <SuccessAlert
              message={successMessage}
              show={showSuccess}
              setShow={setShowSuccess}
            />

            {isLoginOrSignup === 'login' ? (
              <div className="flex justify-center">
                <p className="text-sm text-white">
                  Don't have an account?{' '}
                  <Link
                    href="/sign-up"
                    className="rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2"
                  >
                    Sign up
                  </Link>
                </p>
              </div>
            ) : (
              <div className="flex justify-center">
                <p className="text-sm text-white">
                  Already have an account?{' '}
                  <Link
                    href="/login"
                    className="rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2"
                  >
                    Sign in
                  </Link>
                </p>
              </div>
            )}

            <div>
              <div className="mt-6 grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={_loginWithGoogle}
                  className="flex w-full items-center justify-center gap-3 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus-visible:ring-transparent"
                >
                  <GoogleSVG className="h-5 w-5" />
                  <span className="text-sm font-semibold leading-6">
                    Google
                  </span>
                </button>

                <button
                  type="button"
                  onClick={_loginWithGithub}
                  className={`flex w-full items-center justify-center gap-3 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus-visible:ring-transparent`}
                >
                  <GithubSVG className="h-5 w-5 text-black" />
                  <span className="text-sm font-semibold leading-6">
                    GitHub
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
