import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline'

export default function Login() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [form, setForm] = useState({ email: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    try {
      const res = await axios.post<{ token: string }>(
        `${import.meta.env.VITE_API_URL}/api/auth/login`,
        form,
        { headers: { 'Content-Type': 'application/json' } }
      )
      await login(res.data.token)
      navigate('/')
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed')
    }
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#F9FAFB] px-4 sm:px-6 md:px-8 lg:px-10 xl:px-24">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-[90vw] sm:max-w-[540px] h-fit bg-white shadow-lg rounded-xl px-6 py-8 sm:py-12"
      >
        <h2 className="text-3xl font-bold text-center mb-8">Login</h2>

        {error && <div className="mb-4 text-red-600 text-sm">{error}</div>}

        <label className="block mb-4">
          <span className="text-sm sm:text-base text-gray-700 font-medium">Email</span>
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            required
            className="mt-3 block w-full border border-gray-300 bg-white rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-blue-500"
            placeholder="you@example.com"
          />
        </label>

        <label className="block mb-8">
          <span className="text-sm sm:text-base text-gray-700 font-medium">Password</span>
          <div className="relative mt-3">
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={form.password}
              onChange={handleChange}
              required
              className="block w-full border border-gray-300 bg-white rounded-lg px-3 py-2 pr-10 focus:outline-none focus:ring focus:ring-blue-500"
              placeholder="Enter your password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(prev => !prev)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-900 transition"
              tabIndex={-1}
            >
              {showPassword ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
            </button>
          </div>
        </label>

        <button
          type="submit"
          className="w-full py-3 bg-background text-white rounded-lg transition hover:bg-blue-700"
        >
          Login
        </button>

        <p className="mt-6 text-center text-sm text-gray-500">
          Don't have an account?{' '}
          <Link to="/register" className="text-blue-600 hover:underline">
            Sign up
          </Link>
        </p>
      </form>
    </div>
  )
}
