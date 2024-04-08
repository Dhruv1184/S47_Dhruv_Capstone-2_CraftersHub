const  {intializingPassport, routeProtector} = require('../middleware/passport.middleware')
const {userModel} = require('../models/user.model')
const express = require('express')
const passport = require('passport')
const expressSession = require('express-session')
const bcrypt = require('bcryptjs')
const auth = express()
const cors = require('cors')
require('dotenv').config()


auth.use(express.json())
auth.use(cors())
intializingPassport(passport)

auth.use(expressSession({secret:process.env.SESSION_SECRET , resave:false, saveUninitialized:true}))
auth.use(passport.initialize())
auth.use(passport.session())

auth.get('/ping',routeProtector,(req,res)=>{
    res.send('Dhruv khandelwal')
})
auth.get('/user',async (req,res)=>{
    try {
        const data = await userModel.find({})
        res.json(data)
    } catch (error) {
        res.status(401).send(error)
    }    
})

auth.post('/signup',async (req,res)=>{
    try {
        const {name,username,password} = req.body

        if(!(name || username || password)){
            res.status(400).send('All input required')
        }
        const existUser = await userModel.findOne({username})
        if(existUser){
            res.status(400).send("User Already Exist. Please Login")
        }else{
            const hashedPassword = await bcrypt.hash(password,10)

            const newUser = await userModel.create({
                name,
                username,
                password: hashedPassword
            })
            res.json(newUser)
        }
    } catch (error) {
        console.log(error);
    }
})

auth.post('/login',passport.authenticate('local'),async (req,res)=>{
    try {
        if(req.user){
            console.log("auth" , req.user);
            req.session.user = req.user
            res.json(req.user)
        }
        else{
            res.status(401).send('Authentication failed');
        }
        // console.log(req.user);
    } catch (error) {
        console.log(error);
    }
})

auth.get('/auth/google',passport.authenticate("google",{scope:["profile","email"]}))


auth.get('/auth/google/callback',passport.authenticate("google",{
    successRedirect:"http://localhost:5173/product",
    failureRedirect:"http://localhost:9000/login"
}))

auth.get('/login/success',(req,res)=>{
    console.log("req.user",req.user);
    if(req.user){
        res.json({user:req.user})
    }else{
        res.status(400).json({message:"Not authenticated"})
    }
})
module.exports = auth