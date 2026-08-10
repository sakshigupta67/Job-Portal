import React, { useEffect, useState } from 'react'
import { assets } from '../assets/assets'

const ViewApplication = () => {
    const [applications, setApplications] = useState([])

    const fetchApplications = async () => {
        const token = localStorage.getItem('companyToken')
        if (!token) return

        const response = await fetch('http://localhost:3000/api/company/applicants', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
        const data = await response.json()
        if (data.success) {
            setApplications(data.applications)
        }
    }

    const changeStatus = async (applicationId, status) => {
        const token = localStorage.getItem('companyToken')
        const response = await fetch('http://localhost:3000/api/company/change-status', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ applicationId, status }),
        })
        const data = await response.json()
        if (data.success) {
            fetchApplications()
        }
    }

    useEffect(() => {
        fetchApplications()
    }, [])

  return (
    <div className='container mx-auto p-4'>
        <div>
            <table  className='w-full max-w-4xl bg-white border border-gray-200 max-sm:text-sm'>
                <thead>
                    <tr className='border-b border-gray-200'>
                    <th  >#</th>
                    <th className='py-2 px-4 text-left '>User name</th>
                    <th className='py-2 px-4 text-left max-sm:hidden'>Job Title</th>
                    <th className='py-2 px-4 text-left max-sm:hidden'>Location</th>
                    <th className='py-2 px-4 text-left '>Resume</th>
                    <th className='py-2 px-4 text-left '>Action</th>
                    </tr>

                </thead>
    <tbody>
    {applications.map((applicant , index) => (
        <tr key={index} className='text-gray-700' >

<td className='py-2 px-4 border-b border-gray-200 text-center '>{index+1}</td>
<td className='py-2 px-4 border-b border-gray-200 text-center flex '>
<img className='w-10 h-10 rounded-full mr-3 max-sm:hidden ' src={applicant.userId?.image || assets.profile_img} alt="" />
<span>{applicant.userId?.name || 'Applicant'}</span>

</td>

<td  className='py-2 px-4 border-b border-gray-200 max-sm:hidden' >{applicant.jobId?.title || '-'}</td>
<td   className='py-2 px-4 border-b  border-gray-200 max-sm:hidden' >{applicant.jobId?.location || '-'}</td>
<td className='py-2 px-4 border-b  border-gray-200' >
    <a href={applicant.resume || '#'} target='_blank' rel='noreferrer'
    className='bg-blue-50 text-blue-400 px-3 py-1 rounded inline-flex ga-2 items-center'
    > 
       Resume <img src={assets.resume_download_icon} alt="" /> 
    </a>
</td>

<td className='py-2 px-4 border-b border-gray-200 relative'>
    <div className='relative inline-block text-left group'>

        <button className='text-gray-500 action-button '>...</button>
    <div className='z-10 hidden absolute right-0 md:left-0 top-0 mt-2 w-32 bg-white border border-gray-200 rounded shadow group-hover:block'>
        <button onClick={() => changeStatus(applicant._id, 'Accepted')} className='block w-full text-left px-4 py-2 text-blue-500 hover:bg-gray-100 '>Accept</button>
        <button onClick={() => changeStatus(applicant._id, 'Rejected')} className='block w-full text-left px-4 py-2 text-red-500 hover:bg-gray-100 '>Reject</button>

    </div>
    </div>
</td>

        </tr>
    ))}
    </tbody>

            </table>
</div>

    </div>
  )
}

export default ViewApplication