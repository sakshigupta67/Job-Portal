import React, { useState } from 'react'
import { assets } from '../assets/assets'

const RecruiterLogin = () => {

const [state , setState] = useState('Login')
const [name , setName] = useState('')
const [password , setPassword] = useState('')
const [email, setEmail] = useState('')

const[image , setImage] = useState(false)

const[isTextDataSubmitted , setIsTextDataSubmitted] =useState(false)



  return (
    <div className='absolute top-0 left-0 right-0 botttom-0 z-10 blackdrop-blur-sm bg-black/30 flex justify-center items-center'>
 
<form action="">

  <h1>Recruiter Login </h1>
  
  <p>Welcome back! Please sign in to continue </p>
<>
<div>

  <img src={assets.person_icon} alt="" />

  <input onChange={e => setName(e.target.value)} value={name} type="text" placeholder='Company Name'  required/>
</div>


<div>

  <img src={assets.email_icon} alt="" />

  <input onChange={e => setName(e.target.value)} value={name} type="email" placeholder='Email id '  required/>
</div>

<div>

  <img src={assets.lock_icon} alt="" />

  <input onChange={e => setPassword(e.target.value)} value={password} type="password" placeholder='Password'  required/>
</div>

</>

<button>

  {state === 'Login' ? 'login' : 'create account'}
</button>

</form>

    </div>
  )
}

export default RecruiterLogin