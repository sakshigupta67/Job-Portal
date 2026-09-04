import React, { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import { assets } from '../assets/assets'
import moment from 'moment'
import Footer from '../components/Footer'
import { useUser, useAuth } from '@clerk/clerk-react'
import { toast } from 'react-toastify'
import { BACKEND_URL } from '../context/AppContext'

const Applications = () => {
  const [isEdit, setIsEdit] = useState(false)
  const [resume, setResume] = useState(null)
  const [profile, setProfile] = useState(null)
  const [applications, setApplications] = useState([])
  const [loadingProfile, setLoadingProfile] = useState(true)
  const [loadingApps, setLoadingApps] = useState(true)

  const { user } = useUser()
  const { getToken } = useAuth()

  const fetchProfile = async () => {
    if (!user?.id) return
    try {
      setLoadingProfile(true)
      const res = await fetch(`${BACKEND_URL}/api/users/${user.id}`)
      const data = await res.json()
      if (data.success) setProfile(data.user)
    } catch {
      toast.error('Failed to load profile')
    } finally {
      setLoadingProfile(false)
    }
  }

  const fetchApplications = async () => {
    if (!user?.id) return
    try {
      setLoadingApps(true)
      const token = await getToken()
      const res = await fetch(`${BACKEND_URL}/api/jobs/me/applications`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json()
      if (data.success) setApplications(data.applications)
    } catch {
      toast.error('Failed to load applications')
    } finally {
      setLoadingApps(false)
    }
  }

  useEffect(() => {
    fetchProfile()
    fetchApplications()
  }, [user?.id]) // eslint-disable-line react-hooks/exhaustive-deps

  const saveResume = async () => {
    if (!resume || !user?.id) return

    const formData = new FormData()
    formData.append('resume', resume)

    try {
      const token = await getToken()
      const res = await fetch(`${BACKEND_URL}/api/users/${user.id}/resume`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      })
      const data = await res.json()
      if (data.success) {
        toast.success('Resume saved successfully!')
        await fetchProfile()
        setResume(null)
        setIsEdit(false)
      } else {
        toast.error(data.message || 'Failed to save resume')
      }
    } catch {
      toast.error('Unable to reach the server')
    }
  }

  return (
    <>
      <Navbar />
      <div className='container px-4 min-h-[65vh] 2xl:px-20 mx-auto my-10'>

        {/* Resume section */}
        <h2 className='text-xl font-semibold'>Your Resume</h2>
        <div className='flex gap-2 mb-6 mt-3'>
          {isEdit ? (
            <>
              <label className='flex items-center cursor-pointer' htmlFor='resumeUpload'>
                <p className='bg-blue-100 text-blue-600 px-4 py-2 rounded-lg mr-2'>
                  {resume ? resume.name : 'Select Resume'}
                </p>
                <input
                  id='resumeUpload'
                  onChange={(e) => setResume(e.target.files[0])}
                  accept='application/pdf'
                  type='file'
                  hidden
                />
                <img src={assets.profile_upload_icon} alt='' />
              </label>
              <button
                onClick={saveResume}
                disabled={!resume}
                className='bg-green-100 border border-green-400 rounded-lg px-4 py-2 disabled:opacity-50'
              >
                Save
              </button>
              <button
                onClick={() => { setIsEdit(false); setResume(null) }}
                className='text-gray-500 border border-gray-300 rounded-lg px-4 py-2'
              >
                Cancel
              </button>
            </>
          ) : loadingProfile ? (
            <p className='text-gray-500 text-sm'>Loading...</p>
          ) : (
            <div className='flex gap-2'>
              <a
                className='bg-blue-100 text-blue-600 px-4 py-2 rounded-lg'
                href={profile?.resume || '#'}
                target='_blank'
                rel='noreferrer'
              >
                {profile?.resume ? 'Resume' : 'No resume uploaded'}
              </a>
              <button
                onClick={() => setIsEdit(true)}
                className='text-gray-500 border border-gray-300 rounded-lg px-4 py-2'
              >
                Edit
              </button>
            </div>
          )}
        </div>

        {/* Applications table */}
        <h2 className='text-xl font-semibold mb-4'>Jobs Applied</h2>
        {loadingApps ? (
          <p className='text-gray-500 text-sm'>Loading applications...</p>
        ) : applications.length === 0 ? (
          <p className='text-gray-500 text-sm'>You haven&apos;t applied to any jobs yet.</p>
        ) : (
          <table className='min-w-full bg-white border border-gray-200 rounded-lg'>
            <thead>
              <tr>
                <th className='py-3 px-4 border-b border-gray-200 text-left'>Company</th>
                <th className='py-3 px-4 border-b border-gray-200 text-left'>Job Title</th>
                <th className='py-3 px-4 border-b border-gray-200 text-left max-sm:hidden'>Location</th>
                <th className='py-3 px-4 border-b border-gray-200 text-left max-sm:hidden'>Date</th>
                <th className='py-3 px-4 border-b border-gray-200 text-left'>Status</th>
              </tr>
            </thead>
            <tbody>
              {applications.map((app) => (
                <tr key={app._id}>
                  <td className='py-3 px-4 flex items-center gap-2 border-b border-gray-200'>
                    <img
                      className='w-8 h-8 object-contain'
                      src={app.jobId?.companyId?.image || assets.company_icon}
                      alt=''
                    />
                    {app.jobId?.companyId?.name || '-'}
                  </td>
                  <td className='py-2 px-4 border-b border-gray-200'>{app.jobId?.title || '-'}</td>
                  <td className='py-2 px-4 border-b border-gray-200 max-sm:hidden'>
                    {app.jobId?.location || '-'}
                  </td>
                  <td className='py-2 px-4 border-b border-gray-200 max-sm:hidden'>
                    {moment(app.appliedAt || app.createdAt).format('ll')}
                  </td>
                  <td className='py-2 px-4 border-b border-gray-200'>
                    <span
                      className={`px-4 py-1.5 rounded text-sm ${
                        app.status === 'Accepted'
                          ? 'bg-green-100 text-green-700'
                          : app.status === 'Rejected'
                          ? 'bg-red-100 text-red-700'
                          : 'bg-blue-100 text-blue-700'
                      }`}
                    >
                      {app.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      <Footer />
    </>
  )
}

export default Applications
