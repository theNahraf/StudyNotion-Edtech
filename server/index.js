require("dotenv").config();
const express = require("express");
const server = express();
const cookieParser = require("cookie-parser");
const cors = require("cors");
const fileUpload = require("express-fileupload");

//import routes
const courseRoutes = require("./routes/Course");
const userRoutes = require("./routes/User");
const profileRoutes = require("./routes/Profile");
const paymentRoutes = require("./routes/Payments");
const contactUsRoute = require("./routes/Contact");

//import db & config
const dbConnect = require("./config/database");
const {cloudinaryConnect} = require("./config/cloudinary");

const PORT = process.env.PORT || 5000;



//middlewares
//body parser
server.use(express.json());
//cookie parser
server.use(cookieParser());

server.use(
    cors({
        origin: "http://localhost:3000",
        credentials: true,
    })
)
//upload middlawre
server.use(
    fileUpload({
		useTempFiles:true,
		tempFileDir:"/tmp",
	})
)


dbConnect.connect();
cloudinaryConnect();

// routes//

server.use("/api/v1/auth", userRoutes);
server.use("/api/v1/profile", profileRoutes);
server.use("/api/v1/payment", paymentRoutes);
server.use("/api/v1/course", courseRoutes);
server.use("/api/v1/reach", contactUsRoute);



server.listen(PORT, ()=>{
    console.log(`server is running at port ${PORT}`)
})

server.get("/", (req, res)=>{
    return res.json({
        success:true,
        message:"You are live now ,server is running"
    })
})



