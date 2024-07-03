const { intializingPassport, routeProtector } = require('../middleware/passport.middleware')
const { userModel } = require('../models/user.model')
const express = require('express')
const passport = require('passport')
const expressSession = require('express-session')
const bcrypt = require('bcryptjs')
const { User } = require('../controllers/user.controller')
const upload = require('../middleware/Files.middleware')
const auth = express()
// const cors = require('cors')
require('dotenv').config()


// auth.use(cors())
auth.use(express.json())
intializingPassport(passport)

auth.use(expressSession({ secret: process.env.SESSION_SECRET, resave: false, saveUninitialized: true }))
auth.use(passport.initialize())
auth.use(passport.session())

auth.get('/ping', (req, res) => {
    res.send('Dhruv khandelwal')
})

auth.post('/login', (req, res, next) => {
    passport.authenticate("local", (err, user, info) => {
        if (err) { 
            return res.status(500).send("Internal Server Error");
        }
        if (!user) { 
            return res.status(401).send("Invalid credentials");
        }
        req.logIn(user, (err) => {
            if (err) { 
                return res.status(500).send("Login failed");
            }
            return next();
        });
    })(req, res, next);
}, User.LoginLocal);


auth.get('/auth/google', passport.authenticate("google", { scope: ["profile", "email"] }))


auth.get('/auth/google/callback', passport.authenticate("google", {
    successRedirect: "https://crafters-hub.netlify.app/" || 'https://s47-dhruv-capstone-2-crafters-hub.vercel.app/' || 'http://localhost:5173/',
    failureRedirect: `https://s47-dhruv-capstone-2-craftershub-2.onrender.com/login`
}))

auth.get('/login/success', User.SuccessLogin)

//Logout
auth.get('/logout', User.Logout )

// User routes
auth.get('/user',User.GetUser)

auth.get('/update/:id', User.GetUserById)

auth.get('/getOtherUser',User.GetOtherUser)

auth.post('/signup', User.PostUser)

auth.put('/update/:id', upload.single('ownerImg'), User.PutUser)

auth.post('/forgotPassword', User.ForgotPassword)

auth.post('/resetPassword/:id/:token', User.ResetPassword)

auth.post('/otpVerification', User.OTPVerification)
module.exports = auth