import React, { useEffect, useState, useContext } from 'react'
import { useParams } from 'react-router-dom'
import { AppContext, BACKEND_URL } from '../context/AppContext'
import { assets } from '../assets/assets'
import Loading from '../components/Loading'
import Navbar from '../components/Navbar'
import kconvert from 'k-convert'
import moment from 'moment'
import JobCard from '../components/JobCard'
import Footer from '../components/Footer'
import { useUser, useAuth } from '@clerk/clerk-react'
import { toast } from 'react-toastify'

const ApplyJob = () => {
  const { id } = useParams()
  const [jobData, setJobData] = useState(null)
  const [profile, setProfile] = useState(null)
  const [applying, setApplying] = useState(false)
  const [alreadyApplied, setAlreadyApplied] = useState(false)

  const { jobs } = useContext(AppContext)
  const { user } = useUser()
  const { getToken } = useAuth()

  // Fetch job — try context first (instant), fall back to direct API call
  useEffect(() => {
    const fromContext = jobs.find((j) => j._id === id)
    if (fromContext) {
      setJobData(fromContext)
      return
    }
    // Direct API fetch when navigating directly to the URL
    const fetchFromApi = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/api/jobs/${id}`)
        const data = await res.json()
        if (data.success) setJobData(data.job)
      } catch (err) {
        console.error('Failed to fetch job', err)
      }
    }
    fetchFromApi()
  }, [id, jobs])

  // Fetch user profile + check if already applied
  useEffect(() => {
    if (!user?.id) return
    const fetchProfile = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/api/users/${user.id}`)
        const data = await res.json()
        if (data.success) setProfile(data.user)
      } catch (err) {
        console.error('Failed to fetch profile', err)
      }
    }

    const checkApplied = async () => {
      try {
        const token = await getToken()
        const res = await fetch(`${BACKEND_URL}/api/jobs/me/applications`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        const data = await res.json()
        if (data.success) {
          const applied = data.applications.some(
            (app) => app.jobId?._id === id || app.jobId === id
          )
          setAlreadyApplied(applied)
        }
      } catch (err) {
        console.error('Failed to check applications', err)
      }
    }

    fetchProfile()
    checkApplied()
  }, [user?.id, id]) // eslint-disable-line react-hooks/exhaustive-deps

  const applyToJob = async () => {
    if (!user?.id) {
      toast.info('Please sign in to apply for jobs')
      return
    }
    if (!profile?.resume) {
      toast.warning('Please upload a resume on the Applied Jobs page first')
      return
    }
    if (alreadyApplied) {
      toast.info('You have already applied for this job')
      return
    }

    setApplying(true)
    try {
      const token = await getToken()
      const res = await fetch(`${BACKEND_URL}/api/jobs/${id}/apply`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ resumeUrl: profile.resume }),
      })
      const data = await res.json()
      if (data.success) {
        toast.success('Application submitted successfully!')
        setAlreadyApplied(true)
      } else {
        toast.error(data.message || 'Unable to apply')
      }
    } catch {
      toast.error('Failed to submit application')
    } finally {
      setApplying(false)
    }
  }

  if (!jobData) return <Loading />

  // Related jobs from the same company, excluding the current one
  const relatedJobs = jobs
    .filter(
      (j) =>
        j._id !== jobData._id &&
        j.companyId?._id === jobData.companyId?._id
    )
    .slice(0, 4)

  const applyBtnLabel = alreadyApplied ? 'Already Applied' : applying ? 'Applying...' : 'Apply Now'

  return (
    <>
      <Navbar />

      <div className='min-h-screen flex flex-col py-10 container px-4 2xl:px-20 mx-auto'>
        <div className='bg-white text-black rounded-lg w-full'>

          {/* Job header */}
          <div className='flex justify-center md:justify-between flex-wrap gap-8 px-14 py-20 mb-6 bg-sky-50 border border-sky-400 rounded-xl'>
            <div className='flex flex-col md:flex-row items-center'>
              <img
                className='h-24 bg-white rounded-lg p-4 mr-4 max-md:mb-4 border border-gray-300 object-contain'
                src={jobData.companyId?.image || assets.company_icon}
                alt={jobData.companyId?.name}
              />
              <div className='text-center md:text-left text-neutral-700'>
                <h1 className='text-2xl sm:text-4xl font-medium'>{jobData.title}</h1>
                <div className='flex flex-row flex-wrap max-md:justify-center gap-y-2 gap-6 items-center text-gray-600 mt-2'>
                  <span className='flex items-center gap-1'>
                    <img src={assets.suitcase_icon} alt='' />
                    {jobData.companyId?.name}
                  </span>
                  <span className='flex items-center gap-1'>
                    <img src={assets.location_icon} alt='' />
                    {jobData.location}
                  </span>
                  <span className='flex items-center gap-1'>
                    <img src={assets.person_icon} alt='' />
                    {jobData.level}
                  </span>
                  <span className='flex items-center gap-1'>
                    <img src={assets.money_icon} alt='' />
                    CTC: {kconvert.convertTo(jobData.salary)}
                  </span>
                </div>
              </div>
            </div>

            <div className='flex flex-col justify-center text-end text-sm max-md:mx-auto max-md:text-center'>
              <button
                onClick={applyToJob}
                disabled={applying || alreadyApplied}
                className='bg-blue-600 p-2.5 px-10 text-white rounded disabled:opacity-70'
              >
                {applyBtnLabel}
              </button>
              <p className='mt-1 text-gray-600 text-center'>
                Posted {moment(jobData.date).fromNow()}
              </p>
            </div>
          </div>

          <div className='flex flex-col lg:flex-row justify-between items-start'>

            {/* Description */}
            <div className='w-full lg:w-2/3'>
              <h2 className='font-bold text-2xl mb-4'>Job Description</h2>
              <div
                className='rich-text'
                dangerouslySetInnerHTML={{ __html: jobData.description }}
              />
              <button
                onClick={applyToJob}
                disabled={applying || alreadyApplied}
                className='bg-blue-600 p-2.5 px-10 text-white rounded mt-10 disabled:opacity-70'
              >
                {applyBtnLabel}
              </button>
            </div>

            {/* Related jobs */}
            <div className='w-full lg:w-1/3 mt-8 lg:mt-0 lg:ml-8 space-y-5'>
              <h2 className='font-semibold text-lg'>
                More jobs from {jobData.companyId?.name}
              </h2>
              {relatedJobs.length > 0 ? (
                relatedJobs.map((job) => <JobCard key={job._id} job={job} />)
              ) : (
                <p className='text-gray-500 text-sm'>No other jobs from this company.</p>
              )}
            </div>

          </div>
        </div>
      </div>

      <Footer />
    </>
  )
}

export default ApplyJob
