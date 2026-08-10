import React, { useEffect, useState } from 'react'
import moment from 'moment'
import { useNavigate } from 'react-router-dom'

const ManageJobs = () => {


const navigate = useNavigate()
const [jobs, setJobs] = useState([])

const fetchJobs = async () => {
    const token = localStorage.getItem('companyToken')
    if (!token) return

    const response = await fetch('http://localhost:3000/api/company/list-jobs', {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    })
    const data = await response.json()
    if (data.success) {
        setJobs(data.jobs)
    }
}

const toggleVisibility = async (jobId, currentValue) => {
    const token = localStorage.getItem('companyToken')
    const response = await fetch('http://localhost:3000/api/company/change-visibility', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ jobId, isVisible: !currentValue }),
    })
    const data = await response.json()
    if (data.success) {
        fetchJobs()
    }
}

useEffect(() => {
    fetchJobs()
}, [])


  return (
    <div className='container p-4 max-w-5xl'>
        <div className='overflow-x-auto'>
            <table className='min-w-full bg-white border border-gray-200 max-sm:text-sm'>
                <thead>
                    <tr>
                        <th className='py-2 px-4 border-b border-gray-200 text-left  max-sm:hidden'>#</th>
                        <th className='py-2 px-4 border-b border-gray-200 text-left '>Job Title</th>
                        <th className='py-2 px-4 border-b border-gray-200 text-left max-sm:hidden '>Date</th>
                        <th  className='py-2 px-4 border-b border-gray-200 text-left  max-sm:hidden'>Location</th>
                        <th  className='py-2 px-4 border-b border-gray-200 text-center '>Applicant</th>
                        <th  className='py-2 px-4 border-b border-gray-200 text-left '>Visible</th>
                    </tr>
                    </thead>

        <tbody>
            {jobs.map((job, index) => (
            <tr key={index} className='text-gray-700'>
                <td className='py-2 px-4 border-b border-gray-200 max-sm:hidden '>{index+1}</td>
                <td className='py-2 px-4 border-b border-gray-200'>{job.title}</td>
                <td className='py-2 px-4 border-b border-gray-200 max-sm:hidden '>{moment(job.date).format('ll')}</td>
                <td className='py-2 px-4 border-b border-gray-200 max-sm:hidden '>{job.location}</td>
                <td className='py-2 px-4 border-b border-gray-200 text-center'>{job.applicants ?? 0}</td>
                <td className='py-2 px-4 border-b border-gray-200'>
                    <input className ='scale-125 ml-4 ' type="checkbox" checked={job.isVisible ?? true} onChange={() => toggleVisibility(job._id, job.isVisible ?? true)} />
                </td>
            </tr>

            ))}
        </tbody>
            </table>
</div>

<div className='mt-4 flex justify-end'  >
    <button onClick ={() => navigate('/dashboard/add-job')} className='bg-black text-white py-2 px-4 rounded'>Add new job</button>
</div>



    </div>
  )
}

export default ManageJobs