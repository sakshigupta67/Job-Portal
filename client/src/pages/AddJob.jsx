import React, { useContext, useEffect, useRef, useState } from 'react'
import Quill from 'quill'
import { useNavigate } from 'react-router-dom'
import { AppContext, BACKEND_URL } from '../context/AppContext'
import { JobCategories, JobLocations } from '../assets/assets'
import { toast } from 'react-toastify'

const AddJob = () => {
  const [title, setTitle] = useState('')
  const [location, setLocation] = useState('Bangalore')
  const [category, setCategory] = useState('Programming')
  const [level, setLevel] = useState('Beginner level')
  const [salary, setSalary] = useState(0)
  const [loading, setLoading] = useState(false)

  const editorRef = useRef(null)
  const quillRef = useRef(null)
  const navigate = useNavigate()
  const { companyToken, refreshJobs } = useContext(AppContext)

  // Initialise Quill once on mount
  useEffect(() => {
    if (!quillRef.current && editorRef.current) {
      quillRef.current = new Quill(editorRef.current, { theme: 'snow' })
    }
  }, [])

  const onSubmitHandler = async (e) => {
    e.preventDefault()

    if (!companyToken) {
      toast.error('Please log in as a recruiter first')
      return
    }

    const description = quillRef.current ? quillRef.current.root.innerHTML : ''
    if (!description || description === '<p><br></p>') {
      toast.warning('Please add a job description')
      return
    }

    setLoading(true)
    try {
      const res = await fetch(`${BACKEND_URL}/api/company/post-job`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${companyToken}`,
        },
        body: JSON.stringify({
          title,
          description,
          category,
          location,
          level,
          salary: Number(salary),
        }),
      })

      const data = await res.json()

      if (!data.success) {
        toast.error(data.message || 'Unable to create job')
        return
      }

      toast.success('Job posted successfully!')

      // Reset form
      setTitle('')
      setLocation('Bangalore')
      setCategory('Programming')
      setLevel('Beginner level')
      setSalary(0)
      if (quillRef.current) quillRef.current.setText('')

      await refreshJobs()
      navigate('/dashboard/manage-jobs')
    } catch {
      toast.error('Failed to create job')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={onSubmitHandler} className='container p-4 flex flex-col w-full items-start gap-3'>

      {/* Job Title */}
      <div className='w-full'>
        <p className='mb-2'>Job Title</p>
        <input
          type='text'
          placeholder='e.g. Senior React Developer'
          onChange={(e) => setTitle(e.target.value)}
          value={title}
          required
          className='w-full max-w-lg px-3 py-2 border-2 border-gray-300 rounded'
        />
      </div>

      {/* Job Description (Quill) */}
      <div className='w-full max-w-lg'>
        <p className='my-2'>Job Description</p>
        <div ref={editorRef} />
      </div>

      {/* Category / Location / Level */}
      <div className='flex flex-col sm:flex-row gap-2 w-full sm:gap-8'>
        <div>
          <p className='mb-2'>Job Category</p>
          <select
            className='w-full px-3 py-2 border-2 border-gray-300 rounded'
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {JobCategories.map((cat, i) => (
              <option key={i} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div>
          <p className='mb-2'>Job Location</p>
          <select
            className='w-full px-3 py-2 border-2 border-gray-300 rounded'
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          >
            {JobLocations.map((loc, i) => (
              <option key={i} value={loc}>{loc}</option>
            ))}
          </select>
        </div>

        <div>
          <p className='mb-2'>Job Level</p>
          <select
            className='w-full px-3 py-2 border-2 border-gray-300 rounded'
            value={level}
            onChange={(e) => setLevel(e.target.value)}
          >
            <option value='Beginner level'>Beginner level</option>
            <option value='Intermediate level'>Intermediate level</option>
            <option value='Senior level'>Senior level</option>
          </select>
        </div>
      </div>

      {/* Salary */}
      <div>
        <p className='mb-2'>Job Salary (per year)</p>
        <input
          min={0}
          className='w-full px-3 py-2 border-2 border-gray-300 rounded sm:w-[120px]'
          onChange={(e) => setSalary(e.target.value)}
          value={salary}
          type='number'
          placeholder='e.g. 50000'
        />
      </div>

      <button
        type='submit'
        disabled={loading}
        className='w-28 py-3 mt-4 bg-black text-white rounded disabled:opacity-70'
      >
        {loading ? 'Posting...' : 'ADD'}
      </button>
    </form>
  )
}

export default AddJob
