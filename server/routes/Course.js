const express =  require("express");
const router = express.Router();

//course controller import
const {createCourse ,
    getAllCourses, 
     getCourseDetails,
     editCourse,
     getFullCourseDetails,
     getInstructorCourses,
     deleteCourse,
     updateCourseProgress
    } = require("../controller/Course");


//rating and review controller import
const {createRating, 
    getAverageRating, 
    getALLRating
} = require("../controller/RatingAndReview");


//import section ccontroller
const {
    createSection, 
    updateSection, 
    deleteSection
} = require("../controller/Section");


//import subsection controller
const {
    createSubSection, 
    updateSubSection, 
    deleteSubSection
} = require("../controller/Subsection");


//import category controller
const{
    createCategory,
    showAllcategory,
    categoryPageDetails
} = require("../controller/Category");



// importing middlewares
const {auth, isStudent, isAdmin, isInstructor} = require("../middlewares/auth");


// ********************************************************************************************************
//                                      Course routes
// ********************************************************************************************************

//Courses can only be created by instructor thats why we are using middlewares
router.post("/createCourse",auth, isInstructor, createCourse);

router.post("/editCourse", auth, isInstructor, editCourse);

router.post("/getFullCourseDetails", auth, getFullCourseDetails)

router.get("/getInstructorCourses", auth , isInstructor, getInstructorCourses)

router.delete("/deleteCourse", deleteCourse);




//add a seccton to course
router.post("/addSection", auth, isInstructor, createSection);

//update a section 
router.post("/updateSection", auth, isInstructor, updateSection);

//delete a section 
router.post("/deleteSection", auth , isInstructor, deleteSection);

//add a subsection to a section 
router.post("/addSubSection", auth , isInstructor, createSubSection);

//edit a SubSection
router.post("/updateSubSection", auth ,isInstructor, updateSubSection);

//delete SubSection
router.post("/deleteSubSection", auth, isInstructor, deleteSubSection);

//get all registered course
router.get("/getAllCourses", getAllCourses);

//get detail for a specificc courses
router.post("/getCourseDetails", getCourseDetails);

// ********************************************************************************************************
//                                      Category routes (Only by Admin)
// ********************************************************************************************************
// Category can Only be Created by Admin
// TODO: Put IsAdmin Middleware here

router.post("/createCategory",auth, isAdmin, createCategory)
router.get("/showAllcategory", showAllcategory);
router.post("/getCategoryPageDetails", categoryPageDetails);


// ********************************************************************************************************
//                                      Rating and Review
// ********************************************************************************************************


router.post("/createRating", auth, isStudent, createRating);
router.get("/getAverageRating", getAverageRating);
router.get("/getReviews", getALLRating);

router.post("/updateCourseProgress", auth, isStudent, updateCourseProgress);

module.exports = router;
