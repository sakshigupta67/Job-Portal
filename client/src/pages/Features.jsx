import React from 'react'
import { Link } from 'react-router-dom'
import { assets } from '../assets/assets'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const features = [
  {
    name: 'Job Search',
    description: 'Search visible jobs by title, location, category, and level.',
    route: '/',
    icon: assets.search_icon,
    access: 'Public',
    action: 'Browse jobs',
  },
  {
    name: 'Job Details and Apply',
    description: 'Open a job listing, review its details, and submit an application.',
    route: '/apply-job/:id',
    icon: assets.suitcase_icon,
    access: 'Public; sign-in required to apply',
    action: 'Browse jobs',
  },
  {
    name: 'Applied Jobs and Resume',
    description: 'Review application status and upload the resume used for applications.',
    route: '/applications',
    icon: assets.resume_download_icon,
    access: 'Signed-in job seeker',
    action: 'Open applications',
  },
  {
    name: 'Recruiter Dashboard',
    description: 'Manage company job postings and recruiter workflows.',
    route: '/dashboard/manage-jobs',
    icon: assets.home_icon,
    access: 'Signed-in recruiter',
    action: 'Open dashboard',
  },
  {
    name: 'Post a Job',
    description: 'Create a job with a rich-text description, category, location, level, and salary.',
    route: '/dashboard/add-job',
    icon: assets.add_icon,
    access: 'Signed-in recruiter',
    action: 'Add a job',
  },
  {
    name: 'Manage Jobs',
    description: 'See posted jobs, applicant counts, and control job visibility.',
    route: '/dashboard/manage-jobs',
    icon: assets.home_icon,
    access: 'Signed-in recruiter',
    action: 'Manage jobs',
  },
  {
    name: 'Review Applications',
    description: 'Review candidate resumes and accept or reject pending applications.',
    route: '/dashboard/view-applications',
    icon: assets.person_tick_icon,
    access: 'Signed-in recruiter',
    action: 'View applications',
  },
]

const Features = () => {
  return (
    <>
      <Navbar />
      <main className='container px-4 2xl:px-20 mx-auto my-10 min-h-[65vh]'>
        <div className='mb-8'>
          <p className='text-sm font-medium text-blue-600'>Project map</p>
          <h1 className='text-3xl sm:text-4xl font-semibold text-gray-800 mt-2'>Project Features</h1>
          <p className='text-gray-500 mt-3 max-w-2xl'>
            A quick reference for the working job seeker and recruiter features already present in Insiderjobs.
          </p>
        </div>

        <section className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5'>
          {features.map((feature) => (
            <article key={feature.name} className='border border-gray-200 rounded-lg p-5 shadow-sm flex flex-col'>
              <div className='flex items-start gap-4'>
                <div className='w-11 h-11 rounded-lg bg-blue-50 flex items-center justify-center shrink-0'>
                  <img className='w-6 h-6 object-contain' src={feature.icon} alt='' />
                </div>
                <div>
                  <h2 className='text-xl font-medium text-gray-800'>{feature.name}</h2>
                  <p className='text-sm text-gray-500 mt-2'>{feature.description}</p>
                </div>
              </div>

              <div className='mt-5 text-sm text-gray-500'>
                <p><span className='font-medium text-gray-700'>Route:</span> {feature.route}</p>
                <p className='mt-1'><span className='font-medium text-gray-700'>Access:</span> {feature.access}</p>
              </div>

              <Link
                to={feature.route === '/apply-job/:id' ? '/' : feature.route}
                className='mt-5 inline-flex justify-center bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition'
              >
                {feature.action}
              </Link>
            </article>
          ))}
        </section>

        <section className='mt-12 border-t border-gray-200 pt-8'>
          <h2 className='text-2xl font-semibold text-gray-800'>Quick Navigation</h2>
          <div className='flex flex-wrap gap-3 mt-4'>
            <Link className='border border-gray-300 rounded px-4 py-2 text-gray-700 hover:border-blue-500 hover:text-blue-600' to='/'>Home and job search</Link>
            <Link className='border border-gray-300 rounded px-4 py-2 text-gray-700 hover:border-blue-500 hover:text-blue-600' to='/applications'>Applied jobs</Link>
            <Link className='border border-gray-300 rounded px-4 py-2 text-gray-700 hover:border-blue-500 hover:text-blue-600' to='/dashboard/manage-jobs'>Recruiter dashboard</Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}

export default Features
