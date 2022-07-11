const express = require('express');
const router = express.Router();
const verificationImport = require('../models/UserVerificationModel')

// mongodb user model
const User = require('../models/UsersModel');

// Password handler
const bcrypt = require('bcrypt');
// const register = require('./register');

// Email handeler       // updated 3:32 7-9
const nodemailer = require('nodemailer')

// Unique string        // updated 3:32 7-9
const {v4:uuidv4} = require('uuid')


// Email Transporter    // created 7-9
let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.AUTH_EMAIL,
        pass: process.env.AUTH_PASS
    }
})





//Register          // updated 7-9
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
                    const newUser = new User({
                        firstName,
                        lastName,
                        email,
                        login,
                        password: hashedPassword,
                        verified: false //user is never initially verified
                        
                    });

                    newUser.save().then(result => {
                            //send an error of doubleheader
                        // res.json({
                        //     // status: "SUCCESS",
                        //     message: "User was successfully created!",
                        //     data: result,
                        // })
                         //send email
                        verificationEmail({email,result},res)          //code that sends the email
                        
                    }).catch(err => {
                        res.json({
                            status: "FAILED",
                            message: "User could not be created"
                        })
                    })
                }).catch(err => {
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

const verificationEmail = ({email,result},res) => {    // updated 7-9
    let id = result._id
    const currentUrl = "http://localhost:"+process.env.PORT+"/"

    const uniqueString = uuidv4() + id
    const mailOptions = {
        from: process.env.AUTH_EMAIL,
        to: email,
        subject: "Verify Your Email",
        html: `<p>Verify your email address to complete the signup and login</p><p>This link will <b>expire in 6 hours</b>.</p><p> press <a href=${ currentUrl + "api/user/verify/" + id +"/"+ uniqueString }>here</a> to proceed</p>`
    }
    // hash the unique string
    const saltRounds = 10
    bcrypt
    .hash(uniqueString,saltRounds)
    .then((hashedUniqueString) => {
        const newVerification = new verificationImport({
            user: id,
            uniqueString: hashedUniqueString,
            createdAt: Date.now(),
            expiresAt: Date.now()+21600000
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
                                    // res.sendFile(path.join(__dirname, "./../views/verified.html"))       // i dont know what this does 7-10
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

    router.get("/verified", (res,req) => {
        res.sendFile(path.join(_dirname, "./../views/verified.html"))//might need to change
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
                        //Password match
                        res.json({
                            status: "SUCCESS",
                            message: "Signin sucessful",
                            data: data
                        })
                    } else {
                        res.json({
                            status: "FAILED",
                            message: "Invalid Password!"
                        })
                        
                    }
                }).catch(err => {
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

module.exports = router;