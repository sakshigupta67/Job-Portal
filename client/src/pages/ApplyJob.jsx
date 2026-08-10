import React, { useEffect, useState } from 'react'
import { useContext } from 'react'
import { useParams } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import { assets, jobsData } from '../assets/assets'
import Loading from '../components/Loading'
import Navbar from '../components/Navbar'
import kconvert from 'k-convert'
import moment from 'moment'
import JobCard from '../components/JobCard'
import Footer from '../components/Footer'
import { useUser } from '@clerk/clerk-react'


const ApplyJob = () => {


  const { id } = useParams()

  const [JobData, setJobData] = useState(null)
  const [profile, setProfile] = useState(null)
  const [applying, setApplying] = useState(false)

  const { jobs } = useContext(AppContext)
  const { user } = useUser()

  const fetchJob = async () => {
    const data = jobs.filter(job => job._id === id)
    if (data.length !== 0) {
      setJobData(data[0])
      console.log(data[0])
    }
  }
 
  useEffect(() => {
    if (jobs.length > 0) {
      fetchJob()
    }
  }, [id, jobs])

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user?.id) return
      try {
        const response = await fetch(`http://localhost:3000/api/users/${user.id}`)
        const data = await response.json()
        if (data.success) {
          setProfile(data.user)
        }
      } catch (error) {
        console.error(error)
      }
    }

    fetchProfile()
  }, [user?.id])

  const applyToJob = async () => {
    if (!user?.id) {
      alert('Please sign in first')
      return
    }

    if (!profile?.resume) {
      alert('Please upload a resume in Applied Jobs first')
      return
    }

    setApplying(true)
    try {
      const response = await fetch(`http://localhost:3000/api/jobs/${id}/apply`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          resumeUrl: profile.resume,
        }),
      })

      const data = await response.json()
      if (!data.success) {
        alert(data.message || 'Unable to apply')
        return
      }

      alert('Application submitted successfully')
    } catch (error) {
      console.error(error)
      alert('Failed to apply')
    } finally {
      setApplying(false)
    }
  }


  return JobData ? (
    <>
      <Navbar />

      <div className='min-h-screen flex flex-col py-10 container px-4 2xl:px-20 mx-auto'>
        <div className='bg-white text-black rounded-lg w-full '>
          <div className='flex justify-center md:justify-between flex-wrap gap-8 px-14 py-20 mb-6 bg-sky-50 border border-sky-400 rounded-xl'>
            <div className='flex flex-col md:flex-row items-center'>


              <img className='h-24 bg-white rounded-lg p-4 mr-4 max-md:mb-4 border border-gray-300' src={JobData.companyId.image} alt="" />
              <div className='text-center md:text-left text-neutral-700'>
                <h1 className='text-2xl sm:text-4xl font-medium'>{JobData.title}</h1>

                <div className='flex flex-row flex-wrap max-md:justify-center gap-y-2 gap-6 items-center text-gray-600'>
                  <span className='flex items-center gap-1'>
                    <img src={assets.suitcase_icon} alt="" />
                    {JobData.companyId.name}
                  </span>


                  <span className='flex items-center gap-1'>
                    <img src={assets.location_icon} alt="" />
                    {JobData.location}

                  </span>

                  <span className='flex items-center gap-1'>
                    <img src={assets.person_icon} alt="" />
                    {JobData.level}

                  </span>
                  <span >

                    <img src={assets.money_icon} alt="" />
                    CTC:{kconvert.convertTo(JobData.salary)}
                  </span>


                </div>
              </div>
            </div>

            <div className='flex flex-col justify-center text-end text-sm max-md:mx-auto max-md:text-center'>
              <button onClick={applyToJob} disabled={applying} className='bg-blue-600 p-2.5 px-10 text-white rounded disabled:opacity-70'>{applying ? 'Applying...' : 'Apply Now'}</button>
              <p className='mt-1 text-gray-600 text-center'>Posted {moment(JobData.date).fromNow()}</p>
            </div>


          </div>

<div className='flex flex-col lg:flex-row justify-between items-start'>

  <div className='w-full lg:2/3'>
    <h2 className='font-bold text-2xl mb-4'>Job decsription</h2>
    <div className ='rich-text' dangerouslySetInnerHTML={{__html:JobData.description}}></div>
      <button onClick={applyToJob} disabled={applying} className='bg-blue-600 p-2.5 px-10 text-white rounded mt-10 disabled:opacity-70'>{applying ? 'Applying...' : 'Apply Now'}</button>
  </div>
  {/* Right Section More JObs  */}

  <div className='w-full lg:w-1/3 mt-8 lg:mt-0 lg:ml-8 space-y-5'>
<h2>More jobs from {JobData.companyId.name}</h2>
{jobs.filter(job=>job._id !== JobData._id && job.companyId._id === JobData.companyId._id).filter(job => true).slice(0,4).
map((job, index) => <JobCard  key={index} job={job} />)}


  </div>
</div>
 
        </div>

      </div>
<Footer />

       


    </>
  ) : (
    <Loading />
  )
}

export default ApplyJob