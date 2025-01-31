const express  = require("express");
const router = express.Router();

const {login,
     signUp,
     sendOTP,
     changePassword
} = require("../controller/Auth");

const{resetPasswordToken ,
    resetPassword
    }=  require("../controller/ResetPassword");

const {auth} =  require("../middlewares/auth");


// Routes for Login, Signup, and Authentication

// ********************************************************************************************************
//                                      Authentication routes
// ********************************************************************************************************

   
//route for use login
router.post("/login", login)

//route for signup
router.post("/signup", signUp);

//roter for sending otp to the user's mail
router.post("/sendotp", sendOTP);

//route for change password 
router.post("/changepassword", auth , changePassword);
// router.post("/changepassword", auth, (req, res) => {
//     console.log("Request passed auth middleware: ",);
//     // Your change password logic here
// });


// ********************************************************************************************************
//                                      Reset Password
// ********************************************************************************************************

//router for generateing a reset password token
router.post("/reset-password-token", resetPasswordToken);


//route for resetgin user password after verification 
router.post("/reset-password", resetPassword);


module.exports = router;
