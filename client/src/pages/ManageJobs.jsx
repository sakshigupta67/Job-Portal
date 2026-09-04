import React, { useContext, useEffect, useState } from 'react'
import moment from 'moment'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { AppContext, BACKEND_URL } from '../context/AppContext'

const ManageJobs = () => {
  const navigate = useNavigate()
  const { companyToken } = useContext(AppContext)
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchJobs = async () => {
    if (!companyToken) return
    try {
      setLoading(true)
      const response = await fetch(`${BACKEND_URL}/api/company/list-jobs`, {
        headers: { Authorization: `Bearer ${companyToken}` },
      })
      const data = await response.json()
      if (data.success) {
        setJobs(data.jobs)
      } else {
        toast.error(data.message || 'Failed to load jobs')
      }
    } catch {
      toast.error('Unable to reach the server')
    } finally {
      setLoading(false)
    }
  }

  const toggleVisibility = async (jobId, currentValue) => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/company/change-visibility`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${companyToken}`,
        },
        body: JSON.stringify({ jobId, isVisible: !currentValue }),
      })
      const data = await response.json()
      if (data.success) {
        fetchJobs()
      } else {
        toast.error(data.message || 'Failed to update visibility')
      }
    } catch {
      toast.error('Unable to reach the server')
    }
  }

  useEffect(() => {
    fetchJobs()
  }, [companyToken]) // eslint-disable-line react-hooks/exhaustive-deps

  if (loading) {
    return (
      <div className='container p-4 max-w-5xl'>
        <p className='text-gray-500'>Loading jobs...</p>
      </div>
    )
  }

  return (
    <div className='container p-4 max-w-5xl'>
      <div className='overflow-x-auto'>
        <table className='min-w-full bg-white border border-gray-200 max-sm:text-sm'>
          <thead>
            <tr>
              <th className='py-2 px-4 border-b border-gray-200 text-left max-sm:hidden'>#</th>
              <th className='py-2 px-4 border-b border-gray-200 text-left'>Job Title</th>
              <th className='py-2 px-4 border-b border-gray-200 text-left max-sm:hidden'>Date</th>
              <th className='py-2 px-4 border-b border-gray-200 text-left max-sm:hidden'>Location</th>
              <th className='py-2 px-4 border-b border-gray-200 text-center'>Applicants</th>
              <th className='py-2 px-4 border-b border-gray-200 text-left'>Visible</th>
            </tr>
          </thead>
          <tbody>
            {jobs.length === 0 ? (
              <tr>
                <td colSpan={6} className='py-6 text-center text-gray-500'>
                  No jobs posted yet.
                </td>
              </tr>
            ) : (
              jobs.map((job, index) => (
                <tr key={job._id} className='text-gray-700'>
                  <td className='py-2 px-4 border-b border-gray-200 max-sm:hidden'>{index + 1}</td>
                  <td className='py-2 px-4 border-b border-gray-200'>{job.title}</td>
                  <td className='py-2 px-4 border-b border-gray-200 max-sm:hidden'>
                    {moment(job.date).format('ll')}
                  </td>
                  <td className='py-2 px-4 border-b border-gray-200 max-sm:hidden'>{job.location}</td>
                  <td className='py-2 px-4 border-b border-gray-200 text-center'>
                    {job.applicants ?? 0}
                  </td>
                  <td className='py-2 px-4 border-b border-gray-200'>
                    <input
                      className='scale-125 ml-4'
                      type='checkbox'
                      checked={job.isVisible ?? true}
                      onChange={() => toggleVisibility(job._id, job.isVisible ?? true)}
                    />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className='mt-4 flex justify-end'>
        <button
          onClick={() => navigate('/dashboard/add-job')}
          className='bg-black text-white py-2 px-4 rounded'
        >
          Add new job
        </button>
      </div>
    </div>
  )
}

export default ManageJobs
