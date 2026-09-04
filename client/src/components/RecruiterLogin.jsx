import React, { useContext, useEffect, useState } from 'react'
import { assets } from '../assets/assets'
import { AppContext, BACKEND_URL } from '../context/AppContext'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

const RecruiterLogin = () => {
  const [state, setState] = useState('Login')
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [email, setEmail] = useState('')
  const [image, setImage] = useState(null)
  const [isTextDataSubmitted, setIsTextDataSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const { setShowRecruiterLogin, loginCompany } = useContext(AppContext)
  const navigate = useNavigate()

  // Prevent background scroll while modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = 'unset' }
  }, [])

  const onSubmitHandler = async (e) => {
    e.preventDefault()

    // Sign Up: first step collects text data, second step uploads logo
    if (state === 'Sign Up' && !isTextDataSubmitted) {
      setIsTextDataSubmitted(true)
      return
    }

    setLoading(true)
    try {
      const isLogin = state === 'Login'
      const endpoint = isLogin
        ? `${BACKEND_URL}/api/company/login`
        : `${BACKEND_URL}/api/company/register`

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: isLogin ? { 'Content-Type': 'application/json' } : undefined,
        body: isLogin
          ? JSON.stringify({ email, password })
          : (() => {
              const formData = new FormData()
              formData.append('name', name)
              formData.append('email', email)
              formData.append('password', password)
              if (image) formData.append('image', image)
              return formData
            })(),
      })

      const data = await response.json()

      if (data.success) {
        // Store token + company in context (persists to localStorage)
        loginCompany(data.token, data.company)
        setShowRecruiterLogin(false)
        navigate('/dashboard/add-job')
      } else {
        toast.error(data.message || 'Authentication failed')
      }
    } catch {
      toast.error('Unable to reach the server')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='fixed inset-0 z-50 bg-black/60 flex items-center justify-center backdrop-blur-sm'>
      <div className='fixed inset-0' aria-hidden='true' />

      <form
        onSubmit={onSubmitHandler}
        role='dialog'
        aria-modal='true'
        className='relative bg-white p-8 rounded-xl text-slate-700 w-full max-w-md mx-4 z-10'
      >
        <h1 className='text-center text-2xl text-neutral-700 font-medium'>
          {state === 'Login' ? 'Recruiter Login' : 'Recruiter Sign Up'}
        </h1>
        <p className='text-sm mb-2 mt-2 text-center text-slate-500'>
          {state === 'Login'
            ? 'Welcome back! Please sign in to continue.'
            : 'Create your recruiter account.'}
        </p>

        {/* Sign Up step 2: upload company logo */}
        {state === 'Sign Up' && isTextDataSubmitted ? (
          <div className='flex items-center gap-4 my-10'>
            <label htmlFor='image' className='cursor-pointer'>
              <img
                className='w-16 h-16 rounded-full object-cover border border-gray-300'
                src={image ? URL.createObjectURL(image) : assets.upload_area}
                alt='Company logo'
              />
              <input
                onChange={(e) => setImage(e.target.files[0])}
                type='file'
                id='image'
                accept='image/*'
                hidden
              />
            </label>
            <p className='text-sm text-gray-600'>
              Upload Company<br />Logo
            </p>
          </div>
        ) : (
          <>
            {/* Company name — Sign Up only */}
            {state !== 'Login' && (
              <div className='mb-4'>
                <div className='flex items-center gap-3 border border-gray-300 rounded px-3 py-2'>
                  <img className='w-5 h-5' src={assets.person_icon} alt='' />
                  <input
                    className='flex-1 outline-none'
                    onChange={(e) => setName(e.target.value)}
                    value={name}
                    type='text'
                    placeholder='Company Name'
                    required
                  />
                </div>
              </div>
            )}

            {/* Email */}
            <div className='mb-4'>
              <div className='flex items-center gap-3 border border-gray-300 rounded px-3 py-2'>
                <img className='w-5 h-5' src={assets.email_icon} alt='' />
                <input
                  className='flex-1 outline-none'
                  onChange={(e) => setEmail(e.target.value)}
                  value={email}
                  type='email'
                  placeholder='Email address'
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className='mb-4'>
              <div className='flex items-center gap-3 border border-gray-300 rounded px-3 py-2'>
                <img className='w-5 h-5' src={assets.lock_icon} alt='' />
                <input
                  className='flex-1 outline-none'
                  onChange={(e) => setPassword(e.target.value)}
                  value={password}
                  type='password'
                  placeholder='Password'
                  required
                />
              </div>
            </div>
          </>
        )}

        <button
          type='submit'
          disabled={loading}
          className='w-full bg-blue-600 text-white py-2 rounded-3xl mt-4 disabled:opacity-70'
        >
          {loading
            ? 'Please wait...'
            : state === 'Login'
            ? 'Login'
            : isTextDataSubmitted
            ? 'Create Account'
            : 'Next'}
        </button>

        {state === 'Login' ? (
          <p className='text-slate-500 mt-5 text-center'>
            Don&apos;t have an account?{' '}
            <span
              className='text-blue-600 cursor-pointer'
              onClick={() => setState('Sign Up')}
            >
              Sign Up
            </span>
          </p>
        ) : (
          <p className='text-slate-500 mt-5 text-center'>
            Already have an account?{' '}
            <span
              className='text-blue-600 cursor-pointer'
              onClick={() => { setState('Login'); setIsTextDataSubmitted(false) }}
            >
              Login
            </span>
          </p>
        )}

        <img
          onClick={() => setShowRecruiterLogin(false)}
          className='absolute top-5 right-5 cursor-pointer w-5'
          src={assets.cross_icon}
          alt='Close'
        />
      </form>
    </div>
  )
}

export default RecruiterLogin
