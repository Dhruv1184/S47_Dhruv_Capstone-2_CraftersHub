const { userModel } = require('../models/user.model')
const { uploadOnCloudinary } = require('../utils/cloudinary')
const jwt = require('jsonwebtoken')
require('dotenv').config()
const bcrypt = require('bcryptjs')
const { ForgetPasswordMail, otpSignUp, generatedOtp } = require('../utils/nodeMailer')

class User {
    //get request 
    static GetUser = async (req, res) => {
        try {
            const data = await userModel.find({})
            res.json(data)
        } catch (error) {
            console.log(error);
        }
    }

    //Get users other than login
    static GetOtherUser = async (req, res) => {
        try {
            const { senderId } = req.query
            const filteredUser = await userModel.find({ _id: { $ne: senderId } }).select("-password")
            res.json(filteredUser)
        } catch (error) {
            res.status('500').json(error)
        }
    }
    //Post request 
    static PostUser = async (req, res) => {
        try {
            const { name, username, password, otp, validOtp } = req.body

            if (!(name || username || password || otp)) {
                return res.status(400).send('All input required')
            }
            if (validOtp == otp) {
                const existUser = await userModel.findOne({ username })
                if (existUser) {
                    return res.status(400).send("User Already Exist. Please Login")
                } else {
                    const hashedPassword = await bcrypt.hash(password, 10)

                    const newUser = await userModel.create({
                        name,
                        username,
                        password: hashedPassword
                    })
                    res.json(newUser)
                }
            } else {
                res.status(400).send("Invalid OTP")
            }
        } catch (error) {
            console.log(error);
        }
    }
    //GetById request
    static GetUserById = async (req, res) => {
        try {
            const id = req.params.id
            const filterData = await userModel.findById(id)
            res.json(filterData)
        } catch (error) {
            console.log(error);
        }
    }

    //Put request
    static PutUser = async (req, res) => {
        try {
            const id = req.params.id
            const modifiedData = req.body
            const file = req.file
            console.log("body", req.body);
            console.log("file", file);
            if (req.file) {
                const { url } = await uploadOnCloudinary(file.path)

                modifiedData.ownerImg = [url]
            }
            const updatedData = await userModel.findByIdAndUpdate(id, modifiedData, { new: true })
            console.log(updatedData);
            res.json(updatedData)
        } catch (error) {
            console.log(error);
        }
    }

    // Post Forget password 
    static ForgotPassword = async (req, res) => {
        try {
            const { username } = req.body
            console.log(username);
            const findUser = await userModel.findOne({ username })
            if (!findUser) {
                return res.status(400).json({ message: "User not exist" })
            }
            const token = jwt.sign({ id: findUser._id }, process.env.JWT_SECRET, { expiresIn: '5m' })
            ForgetPasswordMail(findUser, token)

            res.json({ "user": findUser })
        } catch (error) {
            console.log(error);
        }
    }
    //Reset password
    static ResetPassword = async (req, res) => {
        try {
            const { id, token } = req.params
            const { password } = req.body
            // console.log(password);
            const verifyResult = jwt.verify(token, process.env.JWT_SECRET)
            const hashedPassword = await bcrypt.hash(password, 10)
            await userModel.findByIdAndUpdate(id, { password: hashedPassword })
            res.send("password changed")
        } catch (error) {
            console.log(error);
        }
    }

    //OTP Verification
    static OTPVerification = async (req, res) => {
        const { email } = req.body
        const Otp = generatedOtp()
        otpSignUp(email, Otp)
        res.json({ validOTP: Otp })
    }

    //Logout
    static Logout = (req, res, next) => {
        req.logOut(function (err) {
            if (err) {
                return next(err)
            }
            console.log("logout");
            res.redirect('https://s47-dhruv-capstone-2-crafters-hub.vercel.app/'||'https://crafters-hub.netlify.app/')
        })
    }

    //Login route passport
    static LoginLocal = async (req, res) => {
        try {
            if (req.user) {
                req.session.user = req.user
                res.json({ user: req.user })
            }
            else {
                console.log("auth fail");
                res.status(401).send('Authentication failed');
            }
        } catch (error) {
            console.log(error);
        }
    }

    //Success Login
    static SuccessLogin = async (req, res) => {
        try {
            const header = req.headers['authorization'];
    
            let user
            if (header) {
                try {
                    const id = header.replace("Bearer ", '')
                    user = await userModel.findById(id)
                } catch (error) {
                    console.log("error in find user", error);
                }
            }
            if (!user) {
                user = req.user
            }
            if (user) {
                res.json({ user })
            } else {
                res.status(400).json({ message: "Not authenticated" })
            }
        } catch (error) {
            console.log(error);
        }
    }
}

module.exports = { User }