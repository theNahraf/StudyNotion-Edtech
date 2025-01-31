import React from 'react'
import ChangeProfilePicture from './ChangeProfilePicture'
import EditProfile from './EditProfile'
import DeleteAccount from './DeleteAccount'
import UpdatePassword from './UpdatePassword'

const Settings = () => {
  return (
    <>
    <h1 className='mb-14 text-3xl font-medium text-richblack-5'>
        Edit Profile
    </h1>

        {/* chage profile picture */}
        <ChangeProfilePicture/>
        {/* profile  */}
        <EditProfile/>
        {/* update passowrd  */}
        <UpdatePassword/>
        {/* delete accoutn  */}
        <DeleteAccount/>
    </>
  )
}

export default Settings