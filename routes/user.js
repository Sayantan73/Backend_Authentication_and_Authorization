const express = require("express")
const router = express.Router();

const {logIn, signUp} = require("../controlers/auth")
const {auth, isStudent, isAdmin} = require("../middlewares/authentisity")

router.post("/login", logIn);
router.post("/signup", signUp);

// testing protected routes for single middleware
router.get("/test", auth, (req, res)=> {
    res.status(201).json({ success: true, message: "Welcome to the protected route for the Test"} )
})

// protected route
router.get("/student", auth, isStudent, (req, res)=> {
    res.status(201).json({ success: true, message: "Welcome to the protected route for the students"} )
})
// protected route
router.get("/admin", auth, isAdmin, (req, res) => {
    res.status(201).json({ success: true, message: "Welcome to the protected route for the Admin"} )
})
router.get("/user", auth, (req, res) => {
    try {
        const user = req.user;
        console.log("id : ", user.id)
        console.log("email : ", user.email)
        console.log("role : ", user.role)
        res.status(201).json({ success: true, message: "User details page"} )
    } catch (error) {
        res.status(500).json({message: false, message: error.message})
    }
})

module.exports = router;