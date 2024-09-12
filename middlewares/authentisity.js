const User = require("../models/User");
const jwt = require("jsonwebtoken");
require("dotenv").config()

exports.auth = (req, res, next)=>{
    try {
        console.log("cookie", req.cookies.token);
        console.log("body", req.body.token);
        console.log("header", req.header("Authorization")?.replace("Bearer ", ""));
        
        // extract jwt token
        const token = req.cookies.token || req.body.token || req.header("Authorization")?.replace("Bearer ", "");
        // console.log(token);
        
        if(!token){
            res.status(401).json({ success: false, message: "token missing"} )
        }
        // verify the token
        try {
            const decode = jwt.verify(token, process.env.JWT_SECRET);
            console.log(decode)
            req.user = decode;
            
        } catch (error) {
            res.status(401).json({ success: false, message: "token is invalid"} )

        }
        next()
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ success: false, message: "authentication failed"} )
        
    }
}

exports.isStudent = (req, res, next)=>{
    try {
        if(req.user.role !== "Student"){
            return res.status(401).json({ success: false, message: "this is a protected route for students"} )
        }
        next()
    } catch (error) {
        console.error(error.message);
        
        res.status(500).json({ success: false, message: "user role is not matching"} )

    }
}
exports.isAdmin = (req, res, next)=>{
    try {
        if(req.user.role !== "Admin"){
            return res.status(401).json({ success: false, message: "this is a protected route for admin"} )
        }
        next()
    } catch (error) {
        console.error(error.message);
        
        res.status(500).json({ success: false, message: "user role is not matching"} )

    }
}