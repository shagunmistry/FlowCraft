'use client'

import Link from 'next/link'
import FlowCraftLogo from '@/images/FlowCraftLogo_New.png'
import Image from 'next/image'
import ErrorAlert from './ErrorAlert'
import { useState } from 'react'
import SuccessAlert from './SuccessAlert'
import { redirect, useRouter } from 'next/navigation'
import { Provider } from '@supabase/supabase-js'

export default function LoginPage({
  login,
  signUp,
  loginWithGithub,
  loginWithGoogle,
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
      window.location.href = res.data.url
    }
  }

  return (
    <>
      <div className="flex min-h-full flex-1 flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <Link href="/">
            <Image
              className="mx-auto rounded-lg shadow-2xl"
              src={FlowCraftLogo}
              alt="FlowCraft Logo"
              height={200}
              width={200}
            />
          </Link>
          <h2 className="mt-6 text-center text-2xl font-bold leading-9 tracking-tight text-pink-500">
            Sign in to FlowCraft
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-[480px]">
          <div className="bg-pink-500 px-6 py-12 shadow sm:rounded-lg sm:px-12">
            <form className="space-y-6">
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

              <div className="flex items-center justify-between">
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
              </div>

              <div className="flex justify-between">
                <button
                  type="button"
                  className="ml-2 flex-1 justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2"
                  onClick={_login}
                >
                  Login
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

            <div className="flex justify-center">
              <p className="text-sm text-white">
                Don't have an account?{' '}
                <button
                  type="button"
                  className="font-semibold text-white hover:text-indigo-500"
                  onClick={_signup}
                >
                  Sign up
                </button>
              </p>
            </div>

            <div>
              <div className="mt-6 grid grid-cols-2 gap-4">
                {/** If in production, dont show the Sign in with Google button */}
                {process.env.NODE_ENV === 'production' ? null : (
                  <button
                    type="button"
                    onClick={_loginWithGoogle}
                    className="flex w-full items-center justify-center gap-3 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus-visible:ring-transparent"
                  >
                    <svg
                      className="h-5 w-5"
                      aria-hidden="true"
                      viewBox="0 0 24 24"
                    >
                      <path
                        d="M12.0003 4.75C13.7703 4.75 15.3553 5.36002 16.6053 6.54998L20.0303 3.125C17.9502 1.19 15.2353 0 12.0003 0C7.31028 0 3.25527 2.69 1.28027 6.60998L5.27028 9.70498C6.21525 6.86002 8.87028 4.75 12.0003 4.75Z"
                        fill="#EA4335"
                      />
                      <path
                        d="M23.49 12.275C23.49 11.49 23.415 10.73 23.3 10H12V14.51H18.47C18.18 15.99 17.34 17.25 16.08 18.1L19.945 21.1C22.2 19.01 23.49 15.92 23.49 12.275Z"
                        fill="#4285F4"
                      />
                      <path
                        d="M5.26498 14.2949C5.02498 13.5699 4.88501 12.7999 4.88501 11.9999C4.88501 11.1999 5.01998 10.4299 5.26498 9.7049L1.275 6.60986C0.46 8.22986 0 10.0599 0 11.9999C0 13.9399 0.46 15.7699 1.28 17.3899L5.26498 14.2949Z"
                        fill="#FBBC05"
                      />
                      <path
                        d="M12.0004 24.0001C15.2404 24.0001 17.9654 22.935 19.9454 21.095L16.0804 18.095C15.0054 18.82 13.6204 19.245 12.0004 19.245C8.8704 19.245 6.21537 17.135 5.2654 14.29L1.27539 17.385C3.25539 21.31 7.3104 24.0001 12.0004 24.0001Z"
                        fill="#34A853"
                      />
                    </svg>
                    <span className="text-sm font-semibold leading-6">
                      Google
                    </span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={_loginWithGithub}
                  className="flex w-full items-center justify-center gap-3 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus-visible:ring-transparent"
                >
                  <svg
                    className="h-5 w-5 fill-[#24292F]"
                    aria-hidden="true"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z"
                      clipRule="evenodd"
                    />
                  </svg>
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
