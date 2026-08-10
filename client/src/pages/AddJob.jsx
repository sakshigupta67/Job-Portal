import React, { useContext, useEffect, useRef, useState } from 'react'
import Quill from 'quill'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import { JobCategories, JobLocations } from '../assets/assets';

const AddJob = () => {

const [title, setTitle] = useState('');
const [location , setLocation] = useState('Bangalore'); 
const [category , setCategory] = useState('Programming');
const [level , setLevel] = useState('Beginner level');
const [salary , setSalary] = useState(0);


const editorRef = useRef(null)
const quillRef = useRef(null)
const navigate = useNavigate()
const { refreshJobs } = useContext(AppContext)


useEffect(() => {
    //initiate quill only once 

    if( !quillRef.current && editorRef.current ){
        quillRef.current = new Quill(editorRef.current , {
            theme: 'snow',
        })
    }

} , [])

const onSubmitHandler = async (e) => {
    e.preventDefault()

    const token = localStorage.getItem('companyToken')
    if (!token) {
        alert('Please log in as a recruiter first')
        return
    }

    const description = quillRef.current ? quillRef.current.root.innerHTML : ''

    try {
        const response = await fetch('http://localhost:3000/api/company/post-job', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                title,
                description,
                category,
                location,
                level,
                salary,
            }),
        })

        const data = await response.json()
        if (!data.success) {
            alert(data.message || 'Unable to create job')
            return
        }

        setTitle('')
        setLocation('Bangalore')
        setCategory('Programming')
        setLevel('Beginner level')
        setSalary(0)

        if (quillRef.current) {
            quillRef.current.setText('')
        }

        await refreshJobs()
        navigate('/dashboard/manage-jobs')
    } catch (error) {
        console.error(error)
        alert('Failed to create job')
    }
}


  return (
    <form onSubmit={onSubmitHandler} className='container p-4 flex flex-col w-full items-start gap-3'>

<div className='w-full' >
    
    <p className='mb-2'>Job Title</p>
    <input type="text" placeholder='Type here'
    onChange={e => setTitle(e.target.value)} value={title}
    required
    className='w-full max-w-lg px-3 py-2 border-2 border-gray-300 rounded'
    />

</div>


<div className='w-full max-w-lg'>

<p className='my-2'>Job Description</p>

<div ref={editorRef}>


</div>

</div>


<div  className='flex flex-col sm:flex-row gap-2 w-full sm:gap-8'>


<div>
    <p className='mb-2'>Job Category</p>
    <select className='w-full px-3 py-2 border-2 border-gray-300 rounded' onChange={e => setCategory(e.target.value)}>
{JobCategories.map((category , index) => (
    <option key={index} value={category}>{category}

    </option>
))}

    </select>
</div>



<div>
    <p className='mb-2'>Job Loctaion</p>
    <select className='w-full px-3 py-2 border-2 border-gray-300 rounded' onChange={e => setLocation(e.target.value)}>
{JobLocations.map((location , index) => (
    <option key={index} value={location}>{location}

    </option>
))}

    </select>
</div>


<div>
    <p className='mb-2'>Job Level</p>
    <select className='w-full px-3 py-2 border-2 border-gray-300 rounded' onChange={e => setLevel(e.target.value)}>
<option value="Beginner level">Beginner level</option>
<option value="Intermediate level">Intermediate level</option>
<option value="Senior level">Senior level</option>

    </select>
</div>

</div>


<div>
    <p className='mb-2'>Job Salary</p>
    <input min={0} className='w-full px-3 py-2 border-2 border-gray-300 rounded sm:w-[120px]' onChange={e => setSalary(e.target.value)} value={salary} type="number" placeholder='2500'/>


</div>

<button className='w-28 py-3 mt-4 bg-black text-white rounded'>ADD</button>
    </form>
  )
}

export default AddJob