const nodemailer = require('nodemailer')
const otpgenterator = require('otp-generator')
require('dotenv').config()



const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL,
        pass: process.env.MAIL_PASS
    }
})

//Forget password mail
const ForgetPasswordMail = (user, token) => {
    const mailOptions = {
        from: process.env.EMAIL,
        to: `${user.username}`,
        subject: "Reset your password",
        text: `Click on this link to reset your password  https://s47-dhruv-capstone-2-craftershub-2.onrender.com/resetPassword/${user._id}/${token}`
    }

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            return res.send({ status: success })
        }
    })
}


//otp generator
const generatedOtp = ()=>{

    const otp = otpgenterator.generate(6,{
        lowerCaseAlphabets:false,
        specialChars:false,
        upperCaseAlphabets:false
    })
    return otp
}
const otpSignUp = (email,Otp)=>{
    
    // const Otp = generatedOtp()

    const otpmailOptions = {
        from: process.env.EMAIL,
        to: `${email}`,
        subject: "Email verification otp",
        text: `Email verification OTP :- ${Otp}`
    }
    
    transporter.sendMail(otpmailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            return res.send({ status : success })
        }
    })
}

const successPayment = (payment_id,order_id,username)=>{
    const successMail = {
        from: process.env.EMAIL,
        to: `${username}`,
        subject: "Order placed!",
        text: `Your order is placed successfully, Your payment Id is ${payment_id} and your order Id is ${order_id}`
    } 

    transporter.sendMail(successMail,function (error, info) {
        if (error) {
            console.log(error);
        } else {
            return res.send({ status : success })
        }
    })
}
module.exports = { ForgetPasswordMail,otpSignUp ,generatedOtp, successPayment}