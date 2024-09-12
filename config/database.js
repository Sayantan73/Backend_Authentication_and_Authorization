const mongoose = require("mongoose");
require("dotenv").config();

const dbConnect = () => {
    mongoose.connect(process.env.DATABASE_URL, {})
    .then(()=>{console.log("database connection successful");})
    .catch((e)=>{console.error(e.message);
                 process.exit(1)})
}

module.exports = dbConnect;