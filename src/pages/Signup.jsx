import React from "react";
import signupImg from '../assets/Images/signup.webp'
import Template from "../Components/Auth/Template";

const Signup= ()=>{

    return(
        <Template
        title="Join the millions learning to code with StudyNotion for free"
        desc1="Build skills for today, tomorrow and beyond."
        desc2="Education to future-Proof your career."
        formtype='signup'
        image={signupImg}

       />
    );
}

export default Signup;