import React, { useContext, useEffect, useState } from 'react'
import { assets } from '../assets/assets'
import { AppContext } from '../context/AppContext'

const RecruiterLogin = () => {
 
const [state , setState] = useState('Login')
const [name , setName] = useState('')
const [password , setPassword] = useState('')
const [email, setEmail] = useState('')

const[image , setImage] = useState(false)

const[isTextDataSubmitted , setIsTextDataSubmitted] =useState(false)

const {setShowRecruiterLogin} = useContext(AppContext)

const onSubmitHandler = async(e) => {
  e.preventDefault()

  if(state == "Sign Up" && !isTextDataSubmitted){
    setIsTextDataSubmitted(true)
  }
}

useEffect(() => {
  document.body.style.overflow = 'hidden'

  return ()=> {
    document.body.style.overflow = 'unset'
  }
} , [])
 

  return (
    <div className='fixed inset-0 z-50 bg-black/60 flex items-center justify-center backdrop-blur-sm'>
      {/* full-screen overlay to block background */}
      <div className='fixed inset-0' aria-hidden="true"></div>

      <form onSubmit = {onSubmitHandler} role="dialog" aria-modal="true" className='relative bg-white p-8 rounded-xl text-slate-700 w-full max-w-md mx-4'>

{
  state === 'Login'
  ? <h1 className='text-center text-2xl text-neutral-700 font-medium'>Recruiter Login </h1>
  :<h1 className='text-center text-2xl text-neutral-700 font-medium'>Recruiter Sign Up </h1>

}

<p className='text-sm mb-2 mt-2 text-center text-slate-500 '>Welcome back! Please sign in to continue </p>

{
  state === "Sign Up" && isTextDataSubmitted
  ? <>

<div className='flex items-center gap-4 my-10'>
<label htmlFor="image">
  <img className= 'w-16 rounded-full 'src={ image ? URL.createObjectURL(image) : assets.upload_area} alt="" />
  <input onChange= {e =>setImage(e.target.files[0])} type="file" id='image' hidden />
</label>
<p>Upload Company <br /> logo</p>


</div>


  </> 
  :  <>

{state !==  'Login' && (
<div className='mb-4'>
  <div className='flex items-center gap-3'>
    <img className='w-6 h-6' src={assets.person_icon} alt="" />
    <input className='flex-1 w-full border border-gray-300 rounded px-3 py-2 outline-none' onChange={e => setName(e.target.value)} value={name} type="text" placeholder='Company Name'  required/>
  </div>
</div>
)}





<div className='mb-4'>
  <div className='flex items-center gap-3'>
    <img className='w-6 h-6' src={assets.email_icon} alt="" />
    <input className='flex-1 w-full border border-gray-300 rounded px-3 py-2 outline-none' onChange={e => setEmail(e.target.value)} value={email} type="email" placeholder='Email id'  required/>
  </div>
</div>

<div className='mb-4'>
  <div className='flex items-center gap-3'>
    <img className='w-6 h-6' src={assets.lock_icon} alt="" />
    <input className='flex-1 w-full border border-gray-300 rounded px-3 py-2 outline-none' onChange={e => setPassword(e.target.value)} value={password} type="password" placeholder='Password'  required/>
  </div>
</div>


</>
}

{state === "Login"  && <p className='text-sm text-blue-600 mt-4 cursor-pointer'>Forgot Password?</p>}



<button type ='submit' className=' w-full bg-blue-600 text-white py-2 rounded-3xl mt-4'>
  {state === 'Login' ? 'login' : isTextDataSubmitted ?  'create account' : 'next'}
</button>

{

state === 'Login'
?<p className='text-slate-500 mt-5 text-center'>Don't have an account? <span  className= 'text-blue-600 cursor-pointer 'onClick={() => setState("Sign Up")}>Sign Up</span></p>
:<p className='text-slate-500 mt-5 text-center'>Already have an account? <span className= 'text-blue-600 cursor-pointer ' onClick={() => setState("Login")}>Login</span></p>

}

<img onClick={e => setShowRecruiterLogin(false)} className = 'absolute top-5 right-5 cursor-pointer' src={assets.cross_icon} alt="" />


</form>

    </div>
  )
}

export default RecruiterLogin