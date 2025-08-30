import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline'
import GoogleIcon from '/google.svg'

export default function Register() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/register`,
        form,
        { headers: { 'Content-Type': 'application/json' } }
      )
      navigate('/login')
    } catch (err: any) {
      setError(err.response?.data?.message || 'Что-то пошло не так')
    }
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#F9FAFB] px-4 sm:px-6 md:px-8 lg:px-10 xl:px-24">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-[90vw] sm:max-w-[540px] h-auto sm:h-[400px] bg-white shadow-lg rounded-xl px-6 py-8 sm:py-12"
      >
        <h2 className="text-3xl font-bold text-center mb-8">Sign up</h2>

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
          className="w-full py-3 bg-[#1D4ED8] text-white rounded-lg transition hover:bg-blue-700"
        >
          Create an Account
        </button>

        <button
          className="mt-6 w-full py-3 bg-gray-200 text-gray-700 rounded-lg transition hover:bg-gray-300"
          disabled
        >
          <div className="flex justify-center">
            <img src={GoogleIcon} alt="google" className="mr-2" />
            <span>Sign up with Google</span>
          </div>
        </button>

        <p className="mt-4 text-center text-sm text-gray-500">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-600 hover:underline">
            Sign In
          </Link>
        </p>
      </form>
    </div>
  )
}
