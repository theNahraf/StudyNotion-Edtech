const Course = require("../models/Course");
const Category = require("../models/Category");
const User = require("../models/User");
const {uploadImageToCloudinary} = require("../Utils/imageUploader");
const SubSection = require("../models/SubSection")
const Section  = require("../models/Section")
const CourseProgress = require("../models/CourseProgress")
const mongoose = require("mongoose")
const {convertSecondsToDuration} = require("../Utils/convertSecondsToDuration")
//create course handerlr fuction 

exports.createCourse = async (req, res)=>{
    try{

        //data fetch 
        //body me category jo hai woh object id hai 
        const{courseName, courseDescription, whatYouWillLearn, price, category} = req.body;

        //get thumbanial
        const thumbnail = req.files.thumbnailImage;
        
        //validaiton 
        if(!courseName || !courseDescription || !whatYouWillLearn || !price || !category || !thumbnail){
            return res.status(400).json({
                success:false,
                message:"All fields are required"
            })
        }

        //checck for instructor
        //instructor jisne course bnaya 
        //user jo instructor lgoin kra uske payload me user.id pass kri thi 
        //user is already loggeed in, we are just chekcing it is instructor
        //becos it is protected route
        const userid  = req.user.id;

        const instructorDetails = await User.findById(userid);
        console.log("instructor Details: ", instructorDetails);

        if(!instructorDetails){
            return res.status(404).json({
                success:false,
                message:"instructor details not found"
            })
        }

//        todo : verify that userId and instrucctorDetails._id same or different?

        if(userid.toString() !==instructorDetails._id.toString()){
            return res.status(403).json({
                success:false,
                message:"Unauthorised detect, this is protected route for intstructor only"
            })
        }       

        // hw ->  check given category is vaild or not
        // kyki category ki id pass hui hai 
        const categoryDetails  = await Category.findById(category);

        if(!categoryDetails){
            return res.status(404).json({
                success:false,
                message:"category details not found"
            })
        }

        //upload image to cloudinary
        const thumbnailImage  =  await uploadImageToCloudinary(thumbnail, process.env.FOLDER_NAME);

        //create an entry for new course

        const newCourse  = await Course.create({
            courseName,
            courseDescription,
            instructor : instructorDetails._id,
            whatYouWillLearn : whatYouWillLearn,
            price,
            category: categoryDetails._id,
            thumbnail : thumbnailImage.secure_url


        })

        //user -> instrucctor ki list me daal do , instrucctor dont need to by 
        //add the new course to the user schmea of instructor
         await  User.findByIdAndUpdate(
            instructorDetails._id,
            {
                $push:{
                    courses : newCourse._id
                }
            },
            {new:true}
         )

         //update the category ka schema
         //category bhi to select kri hai instructor ne, to uske category k course me course addk ro 


         await Category.findByIdAndUpdate(
            categoryDetails._id,
            {
                $push:{
                    courses: newCourse._id
                },
                
            },
            {new:true}
         )

         //return response

         return res.status(200).json({
            success:true,
            message:"Coure Created Successfullly",
            data:newCourse
         });

    }catch(error){

        console.error(error);
        return res.status(500).json({
            success:false,
            message:"Failed to create Course ",
            error : error.message
        })

    }
}

//edit courwse 
exports.editCourse = async(req, res)=>{
    try{
        const {courseId} = req.body
        const updates = req.body
        const course = await Course.findById(courseId);

        if(!course){
            return res.status(404).json({
                success: false,
                error: "course not found"
            })
        }

        //if thumbanail is fond then update
        if(req.files){
            console.log("thumnail updateas")
            const thumbanail = req.files.thumbnailImage
            const thumbnailImage = await uploadImageToCloudinary(
                thumbanail,
                process.env.FOLDER_NAME
            )
            course.thumbnail = thumbnailImage.secure_url
        }

        //updates only the field that are present in the request body

        for(const key in updates){
            if(updates.hasOwnProperty(key)){
                if(key ===  "tag" || key === "instructions" ){
                    course[key] = JSON.parse(updates[key])
                }
                else{
                    course[key] = updates[key]
                }
            }
        }

        await course.save()

        const updatedCourse = await Course.findOne({
            _id:courseId
        })
        .populate({
            path:"instructor",
            populate:{
                path:"additionalDetails"
            },
        })
        .populate("category")
        .populate("ratingAndReviews")
        .populate({
            path:"courseContent",
            populate:{
                path:"subSection",
            }
        })
        .exec()



        return res.json({
            success:true,
            message:"Course Updated Successfully",
            data : updatedCourse
        })

    }catch(error){

        console.error(error)
        res.status(500).json({
            success:false,
            message:"Internal server error in edit course",
            error : error.message
        })

    }
}

//getAllCoursrs handler funciton 
exports.getAllCourses = async(req, res)=>{
    try{
        //sare course utha kr le aao , jitte bhi hai.

        const allCourses = await Course.find({}, {courseName:true, 
                                                price:true,
                                                thumbnail:true,
                                                instructor:true,
                                                ratingndReviews:true,
                                                studentEnrolled:true
                                                })
                                                .populate("instructor")
                                                .populate("ratingAndReviews")
                                                .exec();
        
        return res.status(200).json({
            success:true,
            message:"Data from all courses fetched successfully",
            data:allCourses,
        })

    }catch(error){  
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"Cannot Fetch Course data",
            error : error.message
        })

    }
}

// hw - > get entire course detail , all detail but not object id, populate that with section and subsection 

//get course detail s

exports.getCourseDetails = async(req , res)=>{
    try{
        //get id 
        const{courseId} = req.body;
//find course detail 
        const courseDetails = await Course.findById(courseId)
                .populate(
                    {
                        path:"instructor",
                        populate:{
                            path:"additionalDetails",
                        },
                    }
                )
                .populate("category")
                // .populate("ratingAndreviews")
                .populate(
                    {
                        path:"courseContent",
                        populate:{
                            path:"subSection"
                        }
                    }
                )
                .exec();    
    
                //validation 

    if(!courseDetails){
        return res.status(400).json({
            success:false,
            message:`could not find the course with ${courseId}`
        })
    }


    //return response

    return res.status(200).json({
        success:true,
        message:"Course Details fetched successfully",
        data:courseDetails
    })

    }catch(error){
        return res.status(500).json({
            success:false,
            message:error.message
        })
    }
}

//get full course detail s

exports.getFullCourseDetails = async(req, res)=>{
    try{
const courseId= req.body.courseId?.courseId || req.body.courseId
        const userId = req.user.id

        console.log("course id in course controller get full course", courseId)

        // console.log("course object id ", courseObjectId)
        

        const courseDetails = await Course.findOne({
            _id:courseId,
        })
        .populate({
            path:"instructor",
            populate:{
                path:"additionalDetails",
            }
        })
        .populate("category")
        .populate("ratingAndReviews")
        .populate({
            path:"courseContent",
            populate:{
                path:"subSection"
            }
        })
        .exec()

        let courseProgressCount = await CourseProgress.findOne({
            courseId :courseId,
            userId : userId
        })


        console.log("Course Progress Count : ", courseProgressCount)

        if(!courseDetails){
            return res.status(400).json({
                success:false,
                message:`could Not Find Course with id: ${courseId}`,
            })
        }

        let totalDurationInSeconds = 0
        courseDetails.courseContent.forEach((content)=>{
            content.subSection.forEach((subSection)=>{
                const timeDurationInSeconds = parseInt(subSection.timeDuration)
                totalDurationInSeconds +=  timeDurationInSeconds
            })
        })

        const totalDuration = convertSecondsToDuration(totalDurationInSeconds)


        return res.status(200).json({
            success:true,
            data:{
                courseDetails,
                totalDuration,
                completedVideos : courseProgressCount?.completedVideos
                ? courseProgressCount?.completedVideos
                :[]

            }

        })

    }
    catch(error){
        console.error(error)
        return res.status(500).json({
            success:false,
            message:"error  while get full course details",
            error:error.message
        })
    }
}


exports.getInstructorCourses = async (req, res)=>{
    try{
    
        const instructorId = req.user.id

        //find all courses belonggin to the instructor
        const instructorCourses = await Course.find({
            instructor:instructorId
        }).sort({createdAt : -1})
         


        //return the instructor courses
        return res.status(200).json({
            success:true,
            data: instructorCourses
        })


    }catch(error){
        console.error(error)
        res.status(500).json({
            success:false,
            message:"Failed To retrieve Instructor courses",
            error:error.message
        })

    }
}


exports.deleteCourse = async(req, res)=>{
    try{
      
        const {courseId} = req.body

        //find the course 
        const course  =  await Course.findById(courseId)

        if(!course){
            return res.status(404).json({message:"course not found"})
        }

        //unrolled  the student from the course 

        const studentEnrolled = course.studentEnrolled

        for(const studentId of studentEnrolled){
            await User.findByIdAndUpdate(studentId, {
                $pull: {courses : courseId},

            })
        }


        //delete sections and subsections

        const courseSections = course.courseContent
        // console.log("course section in cours controller ",  courseSections)
        
        for(const sectionId of courseSections){
            //delete subsection of the section 
            const section = await Section.findById(sectionId)
            if(section){
                const subSections = section.subSection
                for(const subSectionId of subSections){
                    await SubSection.findByIdAndDelete(subSectionId)
                }
            }
        //delete the section 
        await Section.findByIdAndDelete(sectionId)
        }

        //delete the course
        await Course.findByIdAndDelete(courseId);

        return res.status(200).json({
            success:true,
            message: "Course Delete Successfully"

        })

    }catch(error){
        console.error(error)
        return res.status(500).json({
            success:false,
            message: "Server Error",
            error:error.message
        })
    }
}




