const express = require('express');
const router = express.Router();
const verificationImport = require('../models/UserVerificationModel')

// jwt
const jwt = require('jsonwebtoken');

// mongodb user model
const User = require('../models/UsersModel');

const mongoose = require("mongoose")

 const path = require('path')

// Password handler
const bcrypt = require('bcrypt');
// const register = require('./register');

// mongodb user Password reset link
const PasswordReset = require("./../models/PasswordReset")

// Email handeler       // updated 3:32 7-9
const nodemailer = require('nodemailer')

// Unique string        // updated 3:32 7-9
const {v4:uuidv4} = require('uuid');
const { deleteOne } = require('./../models/PasswordReset');

const herokuUrl = "https://sweatcheck.herokuapp.com/"

const redirectUrl = herokuUrl + "api/user/resetPassword"     // should end up being the page where the user can enter a new password


// Email Transporter    // created 7-9
let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.AUTH_EMAIL,
        pass: process.env.AUTH_PASS
    }
})





//Register          // updated 7-16
router.post('/signup', async (reg, res) => {
    let {firstName, lastName, email, login, password} = reg.body;
    firstName = firstName.trim();
    lastName = lastName.trim();
    email = email.trim();
    login = login.trim();
    password = password.trim();

    if (firstName == "" || lastName == "" || email == "" || login == "" || password == ""){
        res.json({
            status: "FAILED",
            message: "Empty input fields!"
        });
    } else if (!/^[a-zA-Z]*$/.test(firstName)) {
        res.json({
            status: "FAILED",
            message: "Invalid first name entered"
        })
    } else if (!/^[a-zA-Z]*$/.test(lastName)) {
        res.json({
            status: "FAILED",
            message: "Invalid last name entered"
        })
    } else if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
        res.json({
            status: "FAILED",
            message: "Invalid email entered"
        })
    } else if (password.length < 8) {
        res.json({
            status: "FAILED",
            message: "Password is too short"
        })
    } else {
        //Checking if user already exist
        User.find ({email}).then(result => {
            if (result.length){
                res.json({
                    status: "FAILED",
                    message: "User with the provided email already exists"
                })
            } else {
                // Try to create new user
                
                // pasword handling
                const saltRounds = 10;
                bcrypt
                .hash(password, saltRounds)
                .then(hashedPassword => {
                    const token = jwt.sign(
                        { userId: User._id, email },
                        process.env.JWT_SECRET_KEY,
                        {
                        expiresIn: "2h",
                        }
                    );

                    const newUser = new User({
                        firstName,
                        lastName,
                        email,
                        login,
                        password: hashedPassword,
                        verified: false, //user is never initially verified
                        token
                    });

                    newUser.save().then(result => {
                        verificationEmail({email,result},res)          //code that sends the email
                    }).catch(err => {
                        console.log(err)
                        res.json({
                            status: "FAILED",
                            message: "User could not be created"
                        })
                    })
                }).catch(err => {
                    console.log(err)
                    res.json({
                        status: "FAILED",
                        message: "An error occured while hashing password!"
                    })
                })
            }
        }).catch(err => {
            console.log(err);
            res.json({
                status: "FAILED",
                message: "An error occurred while checking for existing user!"
            })
        })
        
    }
})

    // doesnt need jwt
router.post("/resendVerificationLink", async (req ,res) => {
    let {email,userId} = req.body
    await User
    .findById(userId)
    .then((result) => {
        // console.log(result)
        verificationEmail({email,result},res)
    })
    .catch(error => {
        console.log(error)
        res.json({
            status: "FAILED",
            message: "Unknown error has occured"
        })
    })
})

    
    const verificationEmail = async ({email,result},res) => {    // updated 7-15
        let id = result._id
        // const currentUrl = "http://localhost:"+process.env.PORT+"/"
        const currentUrl = herokuUrl

        const uniqueString = uuidv4() + id
        const mailOptions = {
            from: process.env.AUTH_EMAIL,
            to: email,
            subject: "Verify Your Email",
            html: `<p>Verify your email address to complete the signup and login</p><p>This link will <b>expire in 6 hours</b>.</p><p> press <a href=${ currentUrl + "api/user/verify/" + id +"/"+ uniqueString }>here</a> to proceed</p>`
        }
        // hash the unique string
        const saltRounds = 10
        await bcrypt
        .hash(uniqueString,saltRounds)
        .then((hashedUniqueString) => {
            const newVerification = new verificationImport({
                user: id,
                uniqueString: hashedUniqueString,
                createdAt: Date.now(),
                expiresAt: Date.now()+21600000
            })
            verificationImport
            .deleteMany({user:id})  // new line 7-15
            .catch(error => {
                res.json({
                    status: "FAILED",
                    message: "Didn't delete verification request",
                })
            })

            newVerification
            .save()
            .then(() =>
                transporter
                .sendMail(mailOptions)
                .then(() => {       // i cannot get these responses to work,with new user "SUCCESS" status
                    res.json({
                        status: "PENDING",
                        message: "Verification email sent",
                        data: result
                    })
                })
                .catch(error => {
                    console.log(error)
                    res.json({
                        status: "FAILED",
                        message: "Verification email failed",
                    })
                })
                )
            .catch(error => {
                console.log(error)
                res.json({
                    status: "FAILED",
                    message: "Couldn't save verification email data",
                })
            }
        )})
        .catch((error) => {
            res.json({
                status: "FAILED",
                message: "An error occured while hashing email data",
            })
        })
}
    
    // doesnt need jwt
    router.get("/verify/:userId/:uniqueString",(req,res) => {       //updated 7-10
        let { userId, uniqueString } = req.params
        verificationImport
        .find({user:userId})
        .then((result) => {
            if(result.length > 0) {
                //user verification record exists so we proceed

                const {expiresAt} = result[0]
                let hashedUniqueString = result[0].uniqueString
                // checking for expired unique string
                if(expiresAt < Date.now()){
                    // record has expired so we delete it
                    verificationImport.deleteOne({user:userId})
                    .then(() => {
                        User
                        .deleteOne({user:userId})
                        .then(() => {
                            let message = "Link has expired. Please sign up again."
                            res.redirect(`/api/user/verified/error=true&message=${message}`)
                        })
                        .catch((error) => {
                            console.log(error)
                            let message = "Clearing user with expired unique string failed"
                            res.redirect(`/api/user/verified/error=true&message=${message}`)
                        })
                    })
                    .catch((error) => {
                        console.log(error)
                        let message = "An error occured while clearing expired user verification record"
                        res.redirect(`/api/User/verified/error=true&message=${message}`)
                    })
                }else {
                    //valid record exists so we update the user string

                    bcrypt
                    .compare(uniqueString,hashedUniqueString)
                    .then((result) => {
                        if(result){
                            //string match
                            User
                            .updateOne({_id: userId}, {verified: true})
                            .then(() => {
                                verificationImport
                                .deleteOne({userId})
                                .then(() => {
                                    res.redirect('/verified')       //can delete when next line works properly 7-10
                                    // res.sendFile(path.join(__dirname, "./../views/verified.html"))       
                                })
                                .catch(error => {
                                    console.log(error)
                                    let message = " An error has occured while finishing successful verification"
                                    res.redirect(`/api/user/verified/error=true&message=${message}`)
                                })
                            })
                            .catch(error => {
                                console.log(error)
                                let message = "An error occured while updating user record to show verified."
                                res.redirect(`/api/user/verified/error=true&message=${message}`)
                            })
                        }
                        else {
                            // existing record but incorrect verification detail
                            let message = "Invalid verification details passed. check your inbox."
                            res.redirect(`/api/user/verified/error=true&message=${message}`)
                        }
                    })
                    .catch(error => {
                        // user verification record does not exist
                        let message = "An error occured while comparing unique strings"
                        res.redirect(`/api/user/verified/error=true&message=${message}`)
                    })
                }
            }else{
                // user verification record does not exist
                let message = "Account record doesnt exist or has been verified already. Please sign up or log in"
                res.redirect(`/api/user/verified/error=true&message=${message}`)
            }
        })
        .catch((error) => {
            console.log(error)
            let message = " An error has occured while checking for existing user verification record"
            res.redirect(`/api/user/verified/error=true&message=${message}`)
        })

    })

    // doesnt need jwt
    router.get("/verified", (req,res) => {
        res.sendFile(path.join(__dirname, "./../views/verified.html"))//might need to change
    })


// Login
router.post('/signin', (req, res) => {
    let {login, password} = req.body;
    login = login.trim();
    password = password.trim();

    if (login == "" || password == "") {
        res.json({
            status: "FAILED",
            message: "Missing login creditials!"
        })
    } else {
        //check if user exist
        User.find({login}).then(data => {
            if (data.length) {
                //user exist
                
                // check if user is verified

                if (!data[0].verified) {
                    res.json({
                        status: "FAILED",
                        message: "Email hasn't been verified yet. Check your inbox.",
                    });
                } else {
                    const hashedPassword = data[0].password;
                    bcrypt.compare(password, hashedPassword).then(result => {
                    if (result) {
                        const email = data[0].email
                        const userId = data[0]._id
                        console.log(email+" "+userId)
                        const token1 = jwt.sign(
                            { userId:userId , email},       // id and email are really all that is needed, might implement workouts/Exercises
                            process.env.JWT_SECRET_KEY,
                            {
                              expiresIn: "2h",
                            }
                          );
                          // save user token
                          User
                          .findByIdAndUpdate({_id: userId}, {token:token1},{new:true})
                          .then((data) => {
                            //Password match
                            res.json({
                                status: "SUCCESS",
                                message: "Signin sucessful",
                                data: data
                            })
                          })
                          .catch(error => {
                            console.log(error)
                          })
                        
                    } else {
                        res.json({
                            status: "FAILED",
                            message: "Invalid Password!"
                        })
                        
                    }
                }).catch(err => {
                    console.log(err)
                    res.json({
                        status: "FAILED",
                        message: "An error occurred while comparing passwords"
                    })
                })
                }  

                
            } else {
                res.json({
                    status: "FAILED",
                    message: "Invalid login credentials entered!"
                })
            }
        }).catch(err => {
            res.json({
                status: "FAILED",
                message: "An error occurred checking for an existing user"
            })
        })
    }
})

router.post("/requestPasswordReset", async (req,res) => {
    let {email} = req.body
    await User
    .find({email})
    .then((data) => {
       
        if(data.length) {
            
            if(!data[0].verified) {
                console.log(!data[0].verified)
                res.json({
                    status: "FAILED",
                    message: "Email hasn't been verified yet. Check your inbox"
                })
            }else {
                const id = data[0].id
                sendResetEmail({id,email,redirectUrl},res)
            }
        } else {
            res.json({
                status: "FAILED",
                message: "No account with the supplied email exists!"
            })
        }
    })
    .catch(error => {
        console.log(error)
        res.json({
            status: "FAILED",
            message: "An error occured checking for Existing user"
        })
    })
})

const sendResetEmail = async ({id,email,redirectUrl},res) => {
    const resetString = uuidv4() + id

    await PasswordReset
    .deleteMany({user: id})
    .then(result => {
        const mailOptions = {
            from: process.env.AUTH_EMAIL,
            to: email,
            subject: "Reset Password",
            html: `<p>We heard that you lost the password.</p> <p>Don't worry, use the link below to reset it.</p><p>This link <b>expires in 60 minutes</b>.</p><p>Press <a href=${ redirectUrl + "/" + id +"/"+ resetString }>here</a> to proceed.</p>`
        }

        const saltRounds = 10
        bcrypt
        .hash(resetString,saltRounds)
        .then(hashedResetString => {
            // set values in password reset collection
            const newPasswordReset = new PasswordReset({
                user: id,
                resetString:hashedResetString,
                createdAt: Date.now(),
                expiresAt: Date.now()+ 3600000
            })

            newPasswordReset
            .save()
            .then(() => {
                transporter
                .sendMail(mailOptions)
                .then( () => {       
                    res.json({
                        status: "PENDING",
                        message: "Password reset email sent"
                    })
                })
            })
            .catch(error => {
                console.log(error)
                res.json({
                    status: "FAILED",
                    message: "Couldn't save password reset data"
                })
            })
        })
        .catch(error => {
            console.log(error)
            res.json({
                status: "FAILED",
                message: "An error occured while hashing the password reset data"
            })
        })
    })
    .catch(error => {
        console.log(error)
        res.json({
            status: "FAILED",
            message: "Clearing existing password reset records failed"
        })
    })
}

    // doesnt need jwt
router.post("/resetPassword/:userId/:resetString", (req,res) => {
    let { userId, resetString} = req.params
    let {newPassword} = req.body
    PasswordReset
    .find({user:userId})
    .then((result) => {
        // console.log(result.length)
        if(result.length > 0){
            const {expiresAt} = result[0]
            if(expiresAt < Date.now()){

                PasswordReset
                .deleteOne({user:userId})
                .then(() => {
                    res.json({
                        status: "FAILED",
                        message: "Checking for existing password reset record failed 0."
                    })
                })
                .catch(error => {
                    console.log(error)
                    res.json({
                        status: "FAILED",
                        message: "Clearing password reset record failed."
                    })
                })
            }else{
                // valid reset record
                // need a line here that says what the hashed reset string is
                const hashedResetString = result[0].resetString
                bcrypt
                .compare(resetString,hashedResetString)
                .then((result) => {
                    if(result){
                        // strings matched
                        // hash password again
                        const saltRounds = 10
                        bcrypt
                        .hash(newPassword,saltRounds)
                        .then(hashedNewPassword => {
                            User
                            .updateOne({_id:userId},{password: hashedNewPassword})
                            .then(() => {

                                PasswordReset
                                .deleteMany({resetString:hashedResetString})
                                .catch(error => {
                                    res.json({
                                        status: "FAILED",
                                        message: "Error occured deleting reset request."
                                    })
                                })
                                
                                res.json({
                                    status: "SUCCESS",
                                    message: "Password has been reset successfully."
                                })
                            })
                            .catch(error => {
                                console.log(error)
                                res.json({
                                    status: "FAILED",
                                    message: "Updating user password failed."
                                })
                            })
                        })
                        
                        .catch(error => {
                            console.log(error)
                            res.json({
                                status: "FAILED",
                                message: "An error occured while hashing the password reset data"
                            })
                        })
                        //we end here
                    }else {
                        res.json({
                            status: "FAILED",
                            message: "Invalid password reset details passed."
                        })
                    }
                })
                .catch(error => {
                    res.json({
                        status: "FAILED",
                        message: "Comparing password reset strings failed."
                    })
                })
            }

        }else{
            res.json({
                status: "FAILED",
                message: "Password reset request not found."
            })
        }
    })
    .catch(error => {
        console.log(error)
        res.json({
            status: "FAILED",
            message: "Checking for existing password reset record failed."
        })
    })
})


module.exports = router;