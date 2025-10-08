import React, { useContext, useRef } from 'react'
import { assets } from '../assets/assets'
import { AppContext } from '../context/AppContext'

const Hero = () => {
 
const { setSearchFilter, setIsSearched} = useContext(AppContext)


const titleRef = useRef(null)
const locationRef = useRef(null)

 

const onSearch =() => {

    setSearchFilter({
      title:titleRef.current.value,
      location: locationRef.current.value
    })

    setIsSearched(true)

}


  return (
    <div className='container 2xl:px-20 mx-auto my-10'>
      <div className='bg-gradient-to-r from-purple-800 to-purple-950 text-white py-16 text-center mx-2 rounded-xl'>
        <h2 className='text-2xl md:text-3xl lg:text-4xl font-medium mb-4'>
          Over 10,000+ jobs to apply
        </h2>
        <p>
          Your Next Big Career Move Starts Right Here - Explore The Best Job Opportunities And Take The First Step Towards Your Future!
        </p>

        <div className='mt-8 flex flex-col sm:flex-row items-center justify-center gap-4 px-4'>
          {/* Job Search */}
          <div className='flex items-center bg-white rounded-full px-4 py-2 w-full sm:w-1/3'>
            <img src={assets.search_icon} alt="" className='w-5 h-5 mr-2' />
            <input
              type="text"
              placeholder='Search for jobs'
              className='bg-white text-gray-800 placeholder-gray-500 max-sm:text-xs p-2 w-full outline-none rounded-full'
              ref={titleRef}
            />
          </div>

          {/* Location Search */}
          <div className='flex items-center bg-white rounded-full px-4 py-2 w-full sm:w-1/3'>
            <img src={assets.location_icon} alt="" className='w-5 h-5 mr-2' />
            <input
              type="text"
              placeholder='Location'
              className='bg-white text-gray-800 placeholder-gray-500 max-sm:text-xs p-2 w-full outline-none rounded-full'
              ref={locationRef}
            />
          </div>

          {/* Search Button */}
          <button onClick={onSearch} className='bg-white text-purple-800 font-semibold px-6 py-2 rounded-full hover:bg-purple-100 transition'>
            Search
          </button>
        </div>
      </div>





<div className='border border-gray-300 shadow-md mx-2 mt-5 p-6 rounded-md flex' >
  
      <div className='flex justify-center gap-10 lg:gap-16 flex-wrap'>
  <p className='font-medium'>Trusted by</p>
  <img className='h-6' src={assets.microsoft_logo} alt="" />
  <img className='h-6' src={assets.walmart_logo} alt="" />
  <img className='h-6' src={assets.accenture_logo} alt="" />
  <img className='h-6' src={assets.samsung_logo}alt="" />
  <img className='h-6' src={assets.amazon_logo} alt="" />
  <img className='h-6' src={assets.adobe_logo} alt="" />
</div>
      </div>







    </div>

    
  )
}

export default Hero
