import React, { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import { assets } from '../assets/assets'
import moment from 'moment'
import Footer from '../components/Footer'
import { useUser } from '@clerk/clerk-react'

const Applications = ()=> {

const [isEdit , setIsEdit] = useState(false)
const [resume , setResume] = useState(null)
const [profile, setProfile] = useState(null)
const [applications, setApplications] = useState([])
const { user } = useUser()

const fetchProfile = async () => {
  if (!user?.id) return
  const response = await fetch(`http://localhost:3000/api/users/${user.id}`)
  const data = await response.json()
  if (data.success) {
    setProfile(data.user)
  }
}

const fetchApplications = async () => {
  if (!user?.id) return
  const response = await fetch(`http://localhost:3000/api/jobs/me/applications?userId=${user.id}`)
  const data = await response.json()
  if (data.success) {
    setApplications(data.applications)
  }
}

useEffect(() => {
  fetchProfile()
  fetchApplications()
}, [user?.id])

const saveResume = async () => {
  if (!resume || !user?.id) return

  const formData = new FormData()
  formData.append('resume', resume)

  const response = await fetch(`http://localhost:3000/api/users/${user.id}/resume`, {
    method: 'PATCH',
    body: formData,
  })
  const data = await response.json()
  if (data.success) {
    await fetchProfile()
    setIsEdit(false)
  } else {
    alert(data.message || 'Failed to save resume')
  }
}

  return (
    <>
    <Navbar />
    <div className='container px-4 min-h-[65vh] 2xl:px-20 mx-auto my-10'>
      <h2 className='text-xl font-semibold'>Your Resume</h2>
      <div className='flex gap-2 mb-6 mt-3'>
{
  isEdit ?
  <>

  <label className='flex items-center ' htmlFor="resumeUpload">
    <p className='bg-blue-100 text-blue-600 px-4 py-2 rounded-lg mr-2 '>Select Resume</p>
    <input id='resumeUpload' onChange={e=> setResume(e.target.files[0])} accept='application/pdf' type="file" hidden/>
    <img src={assets.profile_upload_icon} alt="" />
  </label>
  <button onClick ={saveResume} className='bg-green-100 border border-green-400 rounded-lg px-4 py-2'>Save</button>
  </>
  :
  <div className='flex gap-2'>
    <a className ='bg-blue-100 text-blue-600 px-4 py-2 rounded-lg' href={profile?.resume || '#'} target='_blank' rel='noreferrer'>
      {profile?.resume ? 'Resume' : 'No resume uploaded'}
    </a>
  <button  onClick={() => setIsEdit(true)} className='text-gray-500 border border-gray-300 rounded-lg px-4 py-2 '>
      Edit
    </button>
    </div>
}
      </div>

<h2 className='text-xl font-semibold mb-4'>Jobs Applied</h2>
<table className='min-w-full bg-white border border-gray-200 rounded-lg'>
  <thead>
    <tr>
      <th className='py-3 px-4 border-b border-gray-200 text-left '>Company</th>
      <th className='py-3 px-4 border-b border-gray-200 text-left '>Job Title</th>
      <th className='py-3 px-4 border-b  border-gray-200 text-left max-sm:hidden'>Location</th>
      <th className='py-3 px-4 border-b  border-gray-200 text-left max-sm:hidden'>Date</th>
      <th className='py-3 px-4 border-b  border-gray-200 text-left '>Status</th>
    </tr>
  </thead>

<tbody>
{applications.map((job, index) => (

<tr>
<td className='py-3 px-4 flex ityems-center gap-2  border-b  border-gray-200' >
  <img className='w-8 h-8' src={job.jobId?.companyId?.image || assets.company_icon} alt="" />
  {job.jobId?.companyId?.name || '-'}
</td>

<td className='py-2 px-4 border-b border-gray-200 '>{job.jobId?.title || '-'}</td>
<td className='py-2 px-4 border-b border-gray-200 max-sm:hidden'>{job.jobId?.location || '-'}</td>
<td className='py-2 px-4 border-b border-gray-200 max-sm:hidden'>{moment(job.appliedAt || job.createdAt).format('ll')}</td>
<td className='py-2 px-4 border-b border-gray-200 '>
  <span className={`${job.status === 'Accepted' ? 'bg-green-100 ' : job.status === 'Rejected' ? 'bg-red-100' : 'bg-blue-100'  } px-4 py-1.5 rounded`}> 
    
    {job.status}</span>
  
  
 </td>

</tr>


) )} 


</tbody>

</table>


    </div>
    
    <Footer />
    
    
    </>
  )
}

export default Applications