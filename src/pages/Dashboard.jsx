import React from 'react'
import { useSelector } from 'react-redux'
import { Outlet } from 'react-router-dom'
import SideBar from '../Components/core/Dashboard/SideBar'

const Dashboard = () => {
    const {loading: authLoading}  = useSelector(state=>state.auth)
    const {loading: profileLoading}  = useSelector(state=>state.profile)

    if(authLoading|| profileLoading){
        return (
            <div className='mt-10 text-white'>
                Loading...
            </div>
        )
    }

  return (
    <div className='relative flex min-h-[cal(100vh-3.5rem)] '>
        <SideBar/>
     
        <div className='mx-auto w-11/12 max-w-[1000px] py-10'>
            <Outlet/>

        </div>

    </div>
  )
}

export default Dashboard