const SubSection = require("../models/SubSection");
const Section = require("../models/Section");
const { uploadImageToCloudinary } = require("../Utils/imageUploader");

//crete subsection 

exports.createSubSection = async(req, res)=>{
    console.log("entering in createsection backennd")
    try{
        //data fetch from req.body
        const{sectionId, title, description} =  req.body;
        //extract video/file
        
        
        const  video = req.files.video;
        // console.log("all the files are here", sectionId, title,  description, video)
        //validation    
        if(!sectionId || !title || !description){
            return res.status(400).json({
                success:false,
                message:"all fields are required"
            })
        }


        
        //upload video to cloudinary to get video url 
        const uploadDetails = await uploadImageToCloudinary(video , process.env.FOLDER_NAME);
        

        // console.log("cloudinry uploading in subsedtiotn ", uploadDetails);

        ///fetcch secure url from response
        //create a subsection
        const subSectionDetails = await SubSection.create({
            title:title,
            // timeDuration:timeDuration,
            timeDuration: `${uploadDetails.duration}`,
            description : description,
            videoUrl :uploadDetails.secure_url
        })

        //update section  with subsection by its object id
        const updatedSection = await Section.findByIdAndUpdate({_id:sectionId},
                                                        {$push:{
                                                            subSection : subSectionDetails._id,
                                                        }},
                                                        {new:true}
        ).populate("subSection").exec();
        //hw : log updated section here , after adding populate  query 

        console.log("Updated Section -> ", updatedSection);


        //response
        return res.status(200).json({
            success:true, 
            message:"subsection create sucessfully",
            updatedSection
        })

    }
    catch(error){
        return res.status(500).json({
            success:false, 
            message:"error while create subsecttion ",
            
        })

    }
}


//hw update subsectino 

exports.updateSubSection = async(req, res)=>{

    try{

        const{sectionId, subSectionId, title , description} =req.body

        const subSection = await SubSection.findById(subSectionId);

        if(!subSection){
            return res.status(404).json({
                success:false,
                message:"subSection not found"
            })
        }

        if(title!== undefined){
            subSection.title = title;
        }
        if(description !== undefined){
            subSection.description = description
        }
        if(req.files && req.files.video !== undefined){
            const video = req.files.video
            const uploadDetails =  await uploadImageToCloudinary(video, process.FOLDER_NAME)

            subSection.videoUrl = uploadDetails.secure_url
            subSection.timeDuration = `${uploadDetails.duration}`

        }

        await subSection.save()


        console.log("subsection save in updated subsextom ", subSection)

        //find updates section and return it
        console.log(sectionId)
        const updatedSection = await Section.findById(sectionId).populate("subSection").exec()

        console.log("updated section in subsection ", updatedSection);
        return res.json({
            success:true,
            message:"Section Updated  Successfully",
            data: updatedSection
        })

    }
    catch(error){

        console.error(error)
        return res.status(500).json({
            success: false,
            message : "an error occurred while updating the section "
        })

    }

}
//hw delete subsecton 

exports.deleteSubSection = async(req , res)=>{
    try{
        //data fetch 
        //jab subsection delelte kroge to section se bhi deleter krna hoga na meri jaan 
     //it is not working   // const{subSectionId, sectionId} = req.params || req.body ;

     const subSectionId = req.params.subSectionId || req.body.subSectionId;
     const sectionId = req.params.sectionId || req.body.sectionId;
        
        if(!subSectionId || !sectionId){
            return res.status(401).json({
                success:false,
                message:"subsection and sectoin id not found in request"
            })
        }

        await Section.findByIdAndUpdate(sectionId,
                        {
                            $pull:{
                                subSection:subSectionId,
                            }
                        },
                        {new:true}
        )

        //delete
        const deleteSubSection = await SubSection.findByIdAndDelete(subSectionId);

        if(!deleteSubSection){
            return res.status(404).json({
                success:false,
                message:" Subsection is not found"
            })
        }

        console.log("deleted subsection -> ", deleteSubSection);
        
        //find updated section and return it
        const updatedSection  = await Section.findById(sectionId).populate("subSection").exec()

        //response
        return res.status(200).json({
            success:true,
            message:"section Deleted Successfully",
            data:updatedSection,
            deleteSubSection
        })

    }catch(error){
        return res.status(500).json({
            success:false,
            message:"error while deleting subsection ",
            error: error.message
        })
    }
}