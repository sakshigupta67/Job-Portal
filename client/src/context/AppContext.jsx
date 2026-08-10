import { createContext, useEffect, useState } from "react";
import { jobsData } from "../assets/assets";

export const AppContext = createContext()

export const AppContextProvider = (props) => {

const [searchFilter , setSearchFilter] = useState({

title :'',
location:''
})

const [isSearched , setIsSearched] = useState(false)

const [jobs,setJobs] = useState([])

const [showRecruiterLogin , setShowRecruiterLogin] = useState(false)

const fetchJobs = async() => {
    try {
        const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/jobs`)
        const data = await response.json()

        if (data.success && Array.isArray(data.jobs) && data.jobs.length > 0) {
            setJobs(data.jobs)
            return
        }
    } catch (error) {
        console.error('Failed to load jobs from API, falling back to sample data', error)
    }

    setJobs(jobsData)
}

useEffect(() => {
    fetchJobs()
} , [])

const refreshJobs = async () => {
    await fetchJobs()
}


const value ={

setSearchFilter, searchFilter,
isSearched, setIsSearched,
jobs,setJobs,
showRecruiterLogin , setShowRecruiterLogin,
refreshJobs

}
return (<AppContext.Provider value={value}>
{props.children}

</AppContext.Provider>)
    
}