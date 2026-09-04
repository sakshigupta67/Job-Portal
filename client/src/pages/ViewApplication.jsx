import React, { useContext, useEffect, useState } from 'react'
import { assets } from '../assets/assets'
import { toast } from 'react-toastify'
import { AppContext, BACKEND_URL } from '../context/AppContext'

const ViewApplication = () => {
  const { companyToken } = useContext(AppContext)
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchApplications = async () => {
    if (!companyToken) return
    try {
      setLoading(true)
      const res = await fetch(`${BACKEND_URL}/api/company/applicants`, {
        headers: { Authorization: `Bearer ${companyToken}` },
      })
      const data = await res.json()
      if (data.success) {
        setApplications(data.applications)
      } else {
        toast.error(data.message || 'Failed to load applications')
      }
    } catch {
      toast.error('Unable to reach the server')
    } finally {
      setLoading(false)
    }
  }

  const changeStatus = async (applicationId, status) => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/company/change-status`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${companyToken}`,
        },
        body: JSON.stringify({ applicationId, status }),
      })
      const data = await res.json()
      if (data.success) {
        toast.success(`Application ${status.toLowerCase()}`)
        fetchApplications()
      } else {
        toast.error(data.message || 'Failed to update status')
      }
    } catch {
      toast.error('Unable to reach the server')
    }
  }

  useEffect(() => {
    fetchApplications()
  }, [companyToken]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className='container mx-auto p-4'>
      {loading ? (
        <p className='text-gray-500'>Loading applications...</p>
      ) : applications.length === 0 ? (
        <div className='text-center py-16 text-gray-500'>
          <p className='text-lg font-medium'>No applications yet</p>
          <p className='text-sm mt-1'>Applications will appear here once candidates apply to your jobs.</p>
        </div>
      ) : (
        <table className='w-full max-w-4xl bg-white border border-gray-200 max-sm:text-sm'>
          <thead>
            <tr className='border-b border-gray-200'>
              <th className='py-2 px-4'>#</th>
              <th className='py-2 px-4 text-left'>User name</th>
              <th className='py-2 px-4 text-left max-sm:hidden'>Job Title</th>
              <th className='py-2 px-4 text-left max-sm:hidden'>Location</th>
              <th className='py-2 px-4 text-left'>Resume</th>
              <th className='py-2 px-4 text-left'>Status</th>
              <th className='py-2 px-4 text-left'>Action</th>
            </tr>
          </thead>
          <tbody>
            {applications.map((applicant, index) => (
              <tr key={applicant._id} className='text-gray-700'>
                <td className='py-2 px-4 border-b border-gray-200 text-center'>{index + 1}</td>
                <td className='py-2 px-4 border-b border-gray-200'>
                  <div className='flex items-center gap-2'>
                    <img
                      className='w-10 h-10 rounded-full object-cover max-sm:hidden'
                      src={applicant.userId?.image || assets.profile_img}
                      alt=''
                    />
                    <span>{applicant.userId?.name || 'Applicant'}</span>
                  </div>
                </td>
                <td className='py-2 px-4 border-b border-gray-200 max-sm:hidden'>
                  {applicant.jobId?.title || '-'}
                </td>
                <td className='py-2 px-4 border-b border-gray-200 max-sm:hidden'>
                  {applicant.jobId?.location || '-'}
                </td>
                <td className='py-2 px-4 border-b border-gray-200'>
                  <a
                    href={applicant.resume || '#'}
                    target='_blank'
                    rel='noreferrer'
                    className='bg-blue-50 text-blue-400 px-3 py-1 rounded inline-flex gap-2 items-center'
                  >
                    Resume <img src={assets.resume_download_icon} alt='' />
                  </a>
                </td>
                <td className='py-2 px-4 border-b border-gray-200'>
                  <span
                    className={`px-3 py-1 rounded text-xs font-medium ${
                      applicant.status === 'Accepted'
                        ? 'bg-green-100 text-green-700'
                        : applicant.status === 'Rejected'
                        ? 'bg-red-100 text-red-700'
                        : 'bg-blue-100 text-blue-700'
                    }`}
                  >
                    {applicant.status}
                  </span>
                </td>
                <td className='py-2 px-4 border-b border-gray-200 relative'>
                  {applicant.status === 'Pending' ? (
                    <div className='relative inline-block text-left group'>
                      <button className='text-gray-500 action-button px-2'>•••</button>
                      <div className='z-10 hidden absolute right-0 md:left-0 top-0 mt-8 w-32 bg-white border border-gray-200 rounded shadow group-hover:block'>
                        <button
                          onClick={() => changeStatus(applicant._id, 'Accepted')}
                          className='block w-full text-left px-4 py-2 text-blue-500 hover:bg-gray-100'
                        >
                          Accept
                        </button>
                        <button
                          onClick={() => changeStatus(applicant._id, 'Rejected')}
                          className='block w-full text-left px-4 py-2 text-red-500 hover:bg-gray-100'
                        >
                          Reject
                        </button>
                      </div>
                    </div>
                  ) : (
                    <span className='text-gray-400 text-xs'>—</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}

export default ViewApplication
