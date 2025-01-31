const mongoose = require("mongoose");


const courseProgress =new mongoose.Schema({
    cousreID:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Course"
    },

    completeValidation:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"SubSection"
    }]
    
})

module.exports = mongoose.model("CourseProgress", courseProgress);
