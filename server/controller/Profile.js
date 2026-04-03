const Profile = require("../models/Profile");
const User = require("../models/User");
const Course = require("../models/Course");
const CourseProgress = require("../models/CourseProgress");
const {uploadImageToCloudinary} = require("../Utils/imageUploader")
require("dotenv").config();

const { convertSecondsToDuration } = require("../Utils/convertSecondsToDuration")



exports.updateProfile = async(req,res)=>{
    try{
        //get data
        const{firstName,gender, dateOfBirth="", about="", contactNumber}  =req.body
        // console.log("gender in profile server ",gender)
        // console.log("dob -> ", dateOfBirth);
        // console.log("about  ", about);
        // console.log("contactNumber  ", contactNumber);
        //get user id
        const id = req.user.id;
        // console.log("profile server me id ",id);
        //validation 
        if(!contactNumber || !gender){
            return res.status(400).json({
                success:false,
                message:"all field are reqeuired"
            })
        }
        //update user
        userDetails.firstName = firstName;
        await userDetails.save();

        //find profile
        const profileId = userDetails.additionalDetails;
        const profileDetails = await Profile.findById(profileId);

        //update profile
        profileDetails.dateOfBirth = dateOfBirth;
        profileDetails.about = about;
        profileDetails.gender = gender;
        profileDetails.contactNumber = contactNumber;
        
        //db me entry
        await profileDetails.save();

        const updatedUserDetails = await User.findById(id).populate("additionalDetails").exec();

        //return res
        return res.status(200).json({
            success:true,
            message:"Profile Updated Successfully",
            updatedUserDetails,
        })

    }catch(error){
        return res.status(500).json({
            success:false,
            message:"error while update profile",
            error:error.message
        })

    }
}




//delete account 
//hw ->how can we schedule this delete operation 
exports.deleteAccount = async(req, res)=>{
    try{
        //get id 
         const id = req.user.id;
            
        //validation 
        const userDetails = await User.findById(id);
        if(!userDetails){
            return res.status(404).json({
                success:false,
                message:"User not found "
            })
        }
        //delete profile
        await Profile.findByIdAndDelete({_id:userDetails.additionalDetails});
    
        //delete user
        await User.findByIdAndDelete({_id:id});
        //Todo : HW unroll user form all enrolled course
    
        //return response
        return res.status(200).json({
            success:true,
            message:"Account deleted successfully"
        })

    }catch(error){
        return res.status(500).json({
            success:false,
            message:"error while deleting profile",
            error:error.message
        })
    }
}


exports.getAllUserDetails = async(req, res)=>{
    try{

        //user id fetch 
        const id = req.user.id;
         //validation 

         const userDetails = await User.findById(id).populate("additionalDetails").exec();
         if(!userDetails){
            return res.status(400).json({
                success:false,
                message:"User not found"
            })
         }

        //return res
        return res.status(200).json({
            success:true,
            message:"User Data Fetch Successfully",
            userDetails
        })


    }catch(error){
        return res.status(500).json({
            success:false,
            message:"error while fetching user detals"
        })
    }
}

exports.updateDisplayPicture = async(req, res)=>{
    try{
        const displayPicture = req.files.displayPicture
        const userId= req.user.id

        console.log("display picture in profile  server -> ",displayPicture)
        console.log("user id in profile server ", userId);

        const image = await uploadImageToCloudinary(
        displayPicture,
        process.env.FOLDER_NAME,
        1000,
        1000
        )

        console.log("from backend uploaddisplaypicutre...", image);
        //update from db
        const updatedProfile = await User.findByIdAndUpdate(
            {_id:userId},
            {image:image.secure_url},
            {new:true}
        )

        res.send({
            success:true,
            message:"Display Picture Updated Successfully",
            data:updatedProfile
        })
    }catch(error){
            return res.status(500).json({
                success:false,
                message:`Error while updating display picture -> ${error.message} `
                
            })
    }
}


exports.getEnrolledCourses = async(req, res)=>{
    // console.log("calling backend")
    try{
        const userId = req.user.id
        let userDetails = await User.findOne({
            _id:userId,
        })
        .populate({
            path:"courses",
            populate:{
                path:"courseContent",
                populate:{
                    path:"subSection",
                }
            }
        })
        .exec()
        userDetails = userDetails.toObject()
        var SubsectionLength = 0
        for (var i = 0; i < userDetails.courses.length; i++) {
          let totalDurationInSeconds = 0
          SubsectionLength = 0
          for (var j = 0; j < userDetails.courses[i].courseContent.length; j++) {
            totalDurationInSeconds += userDetails.courses[i].courseContent[
              j
            ].subSection.reduce((acc, curr) => acc + parseInt(curr.timeDuration), 0)
            userDetails.courses[i].totalDuration = convertSecondsToDuration(
              totalDurationInSeconds
            )
            SubsectionLength +=
              userDetails.courses[i].courseContent[j].subSection.length
          }
          let courseProgressCount = await CourseProgress.findOne({
            courseID: userDetails.courses[i]._id,
            userId: userId,
          })
          courseProgressCount = courseProgressCount?.completedVideos.length
          if (SubsectionLength === 0) {
            userDetails.courses[i].progressPercentage = 100
          } else {
            // To make it up to 2 decimal point
            const multiplier = Math.pow(10, 2)
            userDetails.courses[i].progressPercentage =
              Math.round(
                (courseProgressCount / SubsectionLength) * 100 * multiplier
              ) / multiplier
          }
        }

        if(!userDetails){
            return res.status(400).json({
                success:true,
                message:`Could not find user with id :  ${userDetails}`
            })
        }

        return res.status(200).json({
            success:true,
            data:userDetails.courses,
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        })
    }
}

exports.instructorDashboard = async (req, res) => {
    try {
        const courseDetails = await Course.find({ instructor: req.user.id })

        const courseData = courseDetails.map((course) => {
            const totalStudentsEnrolled = course.studentEnrolled.length
            const totalAmountGenerated = totalStudentsEnrolled * course.price

            // Create a new object with the additional fields
            const courseDataWithStats = {
                _id: course._id,
                courseName: course.courseName,
                courseDescription: course.courseDescription,
                // Include other course details as needed
                totalStudentsEnrolled,
                totalAmountGenerated,
            }

            return courseDataWithStats
        })

        res.status(200).json({ success: true, courses: courseData })
    } catch (error) {
        console.error(error)
        res.status(500).json({ success: false, message: "Server Error" })
    }
}

