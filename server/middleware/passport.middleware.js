const {userModel} = require('../models/user.model')
const localStategy = require('passport-local').Strategy
const oauthStategy = require('passport-google-oauth2').Strategy
const bcrypt = require('bcryptjs')
require('dotenv').config()
const intializingPassport = (passport) =>{
    passport.use(new localStategy( async (username,password,done)=>{
        try {
            const user = await userModel.findOne({username})

            if (!user || !(await bcrypt.compare(password, user.password))) {
                // return done(null,false,{ message: 'Invalid username or password' });
                return done(null,false,{message:'Invalid username or password'});
            }

            return done(null,user)   
        } catch (error) {
            return done(error,false)
        }
    }))

    passport.use(
        new oauthStategy({
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            // callbackURL: '/auth/google/callback',
            callbackURL: 'https://s47-dhruv-capstone-2-craftershub-2.onrender.com/auth/google/callback',
            scope:["profile","email"]
        },
        async (accessToken,refreshToken,profile,done)=>{
            try {
                let existUser = await userModel.findOne({username:profile.emails[0].value})
                if(!existUser){
                    user = await userModel.create({
                        name : profile.displayName,
                        username: profile.emails[0].value,
                        ownerImg :[profile.photos[0].value]
                    })
                    return done(null,user)
                }else{
                    done(null,existUser)
                }
            } catch (error) {
                done(error,null)
            }
        }
        )
    )

    passport.serializeUser((user,done)=>{
        done(null,user.id)
    })

    passport.deserializeUser(async (id,done)=>{
        try {
            const user = await userModel.findById(id)
            done(null,user)
        } catch (error) {
            done(error,false)
        }
    })
} 

const routeProtector = async (req,res,next)=>{
    try {
        console.log("protector",req.session);
    
        if(req.user) return next()
    
        res.status(401).send('Please login first')
    } catch (error) {
        console.log(error);
    }
}
module.exports = {intializingPassport,routeProtector }