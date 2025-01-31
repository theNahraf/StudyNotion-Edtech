import React from "react";
import Template from "../Components/Auth/Template";
import loginImg from '../assets/Images/login.webp'


const Login= ()=>{

    return(
       <Template
        title="Welcome Back"
        desc1="Build skills for today, tomorrow and beyond."
        desc2="Education to future-Proof your career."
        formtype='login'
        image={loginImg}
       
       />
    );
}

export default Login;