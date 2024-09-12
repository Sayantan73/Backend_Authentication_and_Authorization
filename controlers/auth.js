const bcrypt = require("bcrypt");
const User = require("../models/User");
const jwt = require("jsonwebtoken")
require("dotenv").config()

exports.signUp = async (req, res)=>{
    try {
        const {name,email, password, role} = req.body;
        const existingUser = await User.findOne({email})
        
        if(existingUser){
            res.status(400).json({success: false, message: "user already exist"})
        }
        // secure password
        let hashedPassword;
        try{
            hashedPassword = await bcrypt.hash(password, 10)
        }catch (error) {
            res.status(500).json({success: false, message: "Error in hashing password"})
        }

        // create entry for user
        const user = await User.create({name, email, password: hashedPassword, role})

        res.status(200).json({success: true, message: "User created successfully", data: user})
    } catch (error) {
        console.error(error.message);
        res.status(500).json({success: false})
    }
}

exports.logIn = async (req, res)=>{
    try {
        const {email, password} = req.body;

        // check all filled's are correctly entered
        if(!email || !password){
            res.status(400).json({success: false, message: "Please fill all the details carefully"})
        }

        let user = await User.findOne({email});
        console.log(user, email, password); 
        

        // if not a register user
        if(!user){
            res.status(401).json({success: false, message: "user is not registered"});
        }

        const payload = {email: user.email, id: user._id, role: user.role} 

        // verify password and generate jwt token
        if (await bcrypt.compare(password, user.password)) {

            // create token using jwt
            const token = jwt.sign(payload, process.env.JWT_SECRET, {expiresIn: "2h"})
            user = user.toObject();
            user.token = token;
            user.password = undefined;

            const options = {
                expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000 ),
                httpOnly: true
            }

            // creating cookie
            res.cookie("token", token, options).status(200).json({success: true, token, user, message: "User logged in successfully"})
        }else{
            // password do not match
            res.status(403).json({success: false, message: "incorrect password"})
        }

    } catch (error) {
        console.error(error.message);
        res.status(500).json({success: false, message: "server Error"})
    } 
}