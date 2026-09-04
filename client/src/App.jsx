import React, { useContext } from 'react'
import{ Route , Routes} from 'react-router-dom'
import Home from './pages/Home'
import ApplyJob from './pages/ApplyJob'
import Applications from './pages/Applications'
import RecruiterLogin from './components/RecruiterLogin'
import { AppContext } from './context/AppContext'
import ManageJobs from './pages/ManageJobs'
import AddJob from './pages/AddJob'
import Dashboard from './pages/Dashboard'
import ViewApplication from './pages/ViewApplication'
import 'quill/dist/quill.snow.css'

const   App = ()=> {

  const {showRecruiterLogin} = useContext(AppContext)
  return (
    <div>


        {showRecruiterLogin && <RecruiterLogin />}

      
      <Routes>

        <Route path='/' element= {<Home />}/>
  
         <Route path='/apply-job/:id' element= {<ApplyJob />}/>
          <Route path='/applications' element= {<Applications />}/>
           <Route path='/dashboard' element={<Dashboard/>}>
           <Route path='manage-jobs' element={<ManageJobs/>} />
           <Route path ='add-job' element={<AddJob/>} />
           <Route path ='view-applications' element={<ViewApplication/>} />
           
           </Route>
 
       </Routes> 
      
      </div>


  )
}

export default App