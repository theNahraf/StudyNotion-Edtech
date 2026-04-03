const mongoose = require("mongoose");
require("dotenv").config();

exports.connect = () => {
    mongoose.connect(process.env.MONGODB_URL)
    .then(() => { console.log("DB connected successfully") })
    .catch((error) => {
        console.log("DB connection failed - server will run without database");
        console.error(error.message);
        // Don't exit - let server run so frontend can still be developed
    })
}
