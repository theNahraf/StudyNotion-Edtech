const jwt = require("jsonwebtoken");
require("dotenv").config();
const User = require("../models/User");

//auth
exports.auth = async(req, res, next)=>{
    // console.log("i am in auth middle ware")
    try{
        //extract token 
        const token = req.cookies.token 
        || req.body.token 
        || req.header("Authorization").replace("Bearer ","")

        //if token is missing
        
        
        
        // console.log("token in auth middleware ");

//         const decodedToken = jwt.decode(token);
// console.log("Decoded token:", decodedToken);


        if(!token){
            return res.status(401).json({
                success:false, 
                message:"Token is missing",
            })
        }
        //verify the token 
        // console.log("env-> ", process.env.JWT_SECRET)
        

        try{
            
            const payload  = await jwt.verify(token , process.env.JWT_SECRET, { algorithms: ['HS256'] });
            console.log("middleware me -> ", payload);

            //req user me payload ko insert kr diya
            req.user = payload;
            

        }catch(error){
            //verifation issue
            return res.status(401).json({
                success:false, 
                message:"token is invalid"
            })
        }

        next();

    }
    catch(error){
        return res.status(401).json({
            success:false,
            message:"something went wrong while validating the token in auth middlware",
            error:error.message
            
            
            
        })
    }
}

//isStudent

    exports.isStudent = (req, res, next)=>{
        try{
            //fetch account type from db
            //inserted payload ko yahan se data nikalo 
            console.log("istudent ke ander aagya ")
            if(req.user.accountType!=="Student"){
                return res.status(401).json({
                    success:false,
                    message:"This is protected  Route for students ONly"
                })
            }
            next();

        }catch(error){
            return res.status(500).json({
                success:false,
                message:"User role  cannot be verified , please try again"
            })
        }
    }

//isInstructor
exports.isInstructor = (req, res, next)=>{
    try{
        //fetch account type from db
        if(req.user.accountType!=="Instructor"){
            return res.status(401).json({
                success:false,
                message:"This is protected  Route for instructor ONly"
            })
        }
        next();

    }catch(error){
        return res.status(500).json({
            success:false,
            message:"User role  cannot be verified , please try again"
        })
    }
}

//isAdmin
exports.isAdmin = (req, res, next)=>{
    try{
        //fetch account type from db

        if(req.user.accountType!=="Admin"){
            return res.status(401).json({
                success:false,
                message:"This is protected  Route for admin ONly"
            })
        }
        next();

    }catch(error){
        return res.status(500).json({
            success:false,
            message:"User role  cannot be verified , please try again"
        })
    }
}
