const express =require("express");
const router =express.Router();

const{auth, isInstructor} = require("../middlewares/auth");

const{updateProfile,
    deleteAccount,
    getAllUserDetails,updateDisplayPicture,
    getEnrolledCourses,
    instructorDashboard
} = require("../controller/Profile");


// ********************************************************************************************************
//                                      Profile routes
// ********************************************************************************************************

//delet profile
router.delete("/deleteProfile", auth, deleteAccount);
//updateProfile
router.put("/updateProfile", auth , updateProfile);
//get user detilas
router.get("/getUserDetails", auth, getAllUserDetails);

//get enrolled courses 
router.get("/getEnrolledCourses", auth , getEnrolledCourses);

//uploaddisplayPcutre
router.put("/updateDisplayPicture",auth, updateDisplayPicture)
router.get("/instructorDashboard", auth, isInstructor, instructorDashboard)

module.exports = router;
