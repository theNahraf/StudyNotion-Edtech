import React, { useState } from 'react'
import {sidebarLinks} from '../../../data/dashboard-links'
import { logout } from '../../../services/operations/authAPI'
import { useDispatch, useSelector } from 'react-redux'
import SideBarLink from './SideBarLink'
import { useNavigate } from 'react-router-dom'
import { VscSignOut } from 'react-icons/vsc'
import ConfirmationModal from '../../common/ConfirmationModal'

const SideBar = () => {
    const {user , loading:profileLoading} = useSelector((state)=> state.profile)
    const {loading:authLoading} = useSelector(state=> state.auth);
    const dispatch = useDispatch();
    const navigate =useNavigate();
    const[confirmationModal , setConfirmationModal] = useState(null); 
    if(profileLoading || authLoading){
        return <div className='mt-10'>Loading...</div>
    }


  return (
    <div className='flex min-w-[222px] flex-col border-r-[1px] border-r-richblack-700 
    h-[calc(100vh-3.5rem)] bg-richblack-800 py-10'>

        <div className='flex flex-col'>
                {
                    sidebarLinks.map((link, index)=>{
                        if(link.type && user?.user?.accountType !== link.type) return null;
                        return (
                            <SideBarLink link={link} iconName={link.icon} key={link.id}/>
                         )
                    })
                }
        </div>

        {/* line */}
        <div className='h-[1px] mx-auto mt-6 mb-6 w-10/12 bg-richblack-600 '></div>

        <div className='flex flex-col'>
                <SideBarLink
                link={{name:"Settings", path:"dashboard/settings"}}
                iconName="VscSettingsGear"
               />

               <button 
               onClick={()=>{
                setConfirmationModal({
                text1:"Are Your Sure ?",
                text2 : "You will be Logged Out of your Account",
                btn1Text:"Logout",
                btn2Text:"Cancel",
                btn1Handler:()=> dispatch(logout(navigate)),
                btn2Handler:()=> setConfirmationModal(null)
                })
               }}
               className='text-sm font-medium text-richblack-300'
               >
                <div className='flex items-center gap-x-2 ml-8 mt-3 text-[15px] text-white'>
                    <VscSignOut className='text-lg'/>
                    <span>Logout</span>
                </div>
               </button>
        </div>

        {
            confirmationModal && <ConfirmationModal modalData={confirmationModal}/>
        }
    </div>
  )
}

export default SideBar