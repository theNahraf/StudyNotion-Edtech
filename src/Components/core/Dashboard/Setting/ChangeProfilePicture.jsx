import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import IconBtn from '../../../common/IconBtn';
import {FiUpload} from 'react-icons/fi'
import {updateDisplayPicture} from '../../../../services/operations/settingAPI'

const ChangeProfilePicture = () => {
  const {token} = useSelector((state)=>state.auth)
  const{user} = useSelector((state)=>state.profile);
  const[loading, setLoading]= useState(false);
  const[imageFile, setImageFile]  = useState(null);
  const[previewSource, setPreviewSource] = useState(null)
  const fileInputRef = useRef(null);
const dispatch = useDispatch();

  const handleClick = ()=>{
    fileInputRef.current.click()
  }



  const handleFileChange = (event)=>{
    const file = event.target.files[0]
    if(file){
      setImageFile(file)
      previewFile(file)
    }
    else{
      console.log("no file selected")
    }
  }
  


  const previewFile = (file)=>{
    const reader = new FileReader()
    if (file && file instanceof Blob) {
      reader.readAsDataURL(file);  // Read the file as a Data URL
  }
    reader.onloadend= ()=>{
      setPreviewSource(reader.result)
    }
  }


  const handleFileUplaod = ()=>{
    try{
      console.log("Uploading...")
      setLoading(true)
      const formData = new FormData();
      formData.append('displayPicture', imageFile);    
      // Inspect FormData contents
      for (let pair of formData.entries()) {
        console.log("printing  form data")
        console.log(pair[0], pair[1]);  // Should log the key 'displayPicture' and the file object
      }
      // console.log("formData...", formData);
      console.log("token [changeProfilePicture] ", token)
      dispatch(updateDisplayPicture(token , formData))
      setLoading(false)

    }catch(error){
      console.log("error while uploading profile... ", error.message)
    }
  }

  useEffect(()=>{
    previewFile(imageFile)
  }, [imageFile])
  
  return (
    <>
      <div className="flex items-center justify-between rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-8 px-12 text-richblack-5">
        <div className="flex items-center gap-x-4">
          <img
            src={previewSource || user?.user?.image}
            alt={`profile-${user?.firstName}`}
            className="aspect-square w-[78px] rounded-full object-cover"
          />
          <div className="space-y-2">
            <p>Change Profile Picture</p>
            <div className="flex flex-row gap-3">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                accept="image/png, image/gif, image/jpeg"
              />
              <button
                onClick={handleClick}
                // disabled={loading}
                className="cursor-pointer rounded-md bg-richblack-700 py-2 px-5 font-semibold text-richblack-50"
              >
                Select
              </button>
              <IconBtn
                text={loading ? "Uploading..." : "Upload"}
                onclick={handleFileUplaod}
              >
                {!loading && (
                  <FiUpload className="text-lg text-richblack-900" />
                )}
              </IconBtn>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default ChangeProfilePicture