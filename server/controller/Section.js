const Section = require("../models/Section");
const Course  =require("../models/Course");
const SubSection = require("../models/SubSection");


//create section 
exports.createSection = async(req, res)=>{
    try{
        //data fetch 
        const{sectionName, courseId} = req.body;

        //data  validation
        if(!sectionName || !courseId){
            return res.status(400).json({
                success:false,
                message:"Misssing Propertiess"
            })
        }


        //create section

        const newSection = await Section.create({sectionName});

        //section update in course schmea by pushing its object id
        //update course with section object id

        const updatedCourseDetails = await Course.findByIdAndUpdate(courseId,
                                                           {
                                                            $push:{
                                                                courseContent : newSection._id
                                                            }
                                                           },
                                                           {new:true}                            
        ).populate({
            path:'courseContent',
            populate: {
                path: 'subSection' // Populate subSection within the courseContent (Section)
            }
        }).exec();

    // ->hw    //use populate to replace section and subsection both in the updated course detail 
        
        //return srespoinse

        return res.status(200).json({
            success:true,
            message:"Section Creted Successfully",
            updatedCourseDetails,
        })



    }catch(error){
        return res.status(500).json({
            success:false,
            message:"error occure while creating section ",
            error:error.message
        })

    }
}



// update section

exports.updateSection= async(req, res)=>{
    // console.log("updateing section backednn")
    try{
        //dqte fetch 
        const{sectionName, sectionId, courseId} = req.body
        // console.log("fetching req boddy data", sectionName, sectionId, courseId)


        //data vaildation 
        if(!sectionName || !sectionId){
            return res.status(400).json({
                success:false,
                message:"Misssing Propertiess"
            })
        }

        //update data
       const section =  await Section.findByIdAndUpdate(sectionId, {sectionName}, {new:true})
        //return res
        const course   = await Course.findById(courseId)
        .populate({
            path:"courseContent",
            populate:{
                path:"subSection"
            }
        })
        .exec()


        // console.log("updated section response" , section);
        // console.log("update corse respose in section backend  ")


        return res.status(200).json({
            success:true,
            message:`Section Updated successfully ${section}`,
            data:course,
        
        })

    }catch(error){
        return res.status(500).json({
            success:false,
            message:"error occure while updating section ",
        //    error: console.log("error update section ",  error.message)

        })
    }
}


//delete seciton 

exports.deleteSection = async (req, res)=>{
    try{
        //getid -> assuming that we are sending id in params

        //hw -> yeh req.params sectoin id ku aaya 
        const sectionId = req.params.sectionId || req.body.sectionId;
        const courseId = req.params.courseId || req.body.courseId;
        //find by id and delete
        
        await SubSection.deleteMany({sectionId})
        await Section.findByIdAndDelete(sectionId);
        const course = await Course.findById(courseId);

        //hw todo : do we need to delete the entry from the course schema
        
        if (course) {
            // Remove the sectionId from the courseContent array
            course.courseContent.pull(sectionId);
            await course.save();
        }



        //returm res
        return res.status(200).json({
            success:true, 
            message:"section deleted successfully",
            data : course
        })

    }catch(error){
        return res.status(500).json({
            success:false,
            message:"error occure while deleting section ",
            error:error.message
            
        })
    }
}