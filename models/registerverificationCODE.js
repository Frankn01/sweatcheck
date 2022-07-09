const verificationImport = require('../models/UserVerificationModel')	// please enter this line near the top


    // send verification email

    const verificationEmail = ({_id,email},res) => {
        const currentUrl = "http://localhost:"+process.env.PORT

        const uniqueString = uuidv4() + _id

        const mailOptions = {
            from: process.env.AUTH_EMAIL,
            to: email,
            subject: "Verify Your Email",
            html: '<div>Verify your email address to complete the signup and login</div><div>This link will expire in 6 hours. press <a href=${ currentUrl + "User/Verify/" + _id + uniqueString }>here</a> to proceed'
        }

        // hash the unique string
        const saltRounds = 10
        bcrypt
        .hash(uniqueString,saltRounds)
        .then((hashedUniqueString) => {
            const newVerification = new verificationImport({
                usedId: _id,
                uniqueString: hashedUniqueString,
                createdAt: Date.now(),
                expiresAt: Date.now()+21600000
            })

            newVerification
            .save()
            .then(() =>
                transporter
                .sendMail(mailOptions)
                .then(() => {
                    res.json({
                        status: "PENDING",
                        message: "Verification email sent"
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

    register.get("/verify/:userId/:uniqueString",(res,req) => {
        let { userId, uniqueString } = req.oarams
        verificationImport
        .find({userId})
        .then((result) => {
            if(result.length > 0) {
                //user verification record exists so we proceed

                const {expiresAt} = result[0]
                const hashedUniqueString = result[0].uniqueString
                // checking for expired unique string
                if(expiresAt < Date.now()){
                    // record has expired so we delete it
                    verificationImport.deleteOne({userId})
                    .then(result => {
                        user
                        .deleteOne({_id:userId})
                        .then(() => {
                            let message = "Link has expired. Please sign up again."
                            res.redirect('/user/verified/error=true&message=${message}')
                        })
                        .catch((error) => {
                            console.log(error)
                            let message = "Clearing user with expired unique string failed"
                            res.redirect('/user/verified/error=true&message=${message}')
                        })
                    })
                    .catch((error) => {
                        console.log(error)
                        let message = "An error occured while clearing expired user verification record"
                        res.redirect('/user/verified/error=true&message=${message}')
                    })
                }else {
                    //valid rcord exists so we update the user string
                    // first compare hashed unique string

                    bcrypt
                    .compare(uniqueString,hashedUniqueString)
                    .then(results => {
                        if(result){
                            //string match
                            usersImport
                            .updateOne({_id: userId}, {verified: true})
                            .then(() => {
                                verificationImport
                                .deleteOne({userId})
                                .then(() => {
                                    res.sendFile(path.join(__dirname, "./../views/verified.html"))
                                })
                                .catch(error => {
                                    console.log(error)
                                    let message = " An error has occured while finishing successful verification"
                                    res.redirect('/user/verified/error=true&message=${message}')
                                })
                            })
                            .catch(error => {
                                console.log(error)
                                let message = "An error occured while updating user record to show verified."
                                res.redirect('/user/verified/error=true&message=${message}')
                            })
                        }else {
                            // existing record but incorrect verification detail
                            let message = "Invalid verification details passed. check your inbox."
                            res.redirect('/user/verified/error=true&message=${message}')
                        }
                    })
                    .catch(error => {
                        // user verification record does not exist
                        let message = "An error occured while comparing unique strings"
                        res.redirect('/user/verified/error=true&message=${message}')
                    })
                }
            }else{
                // user verification record does not exist
                let message = "Account record doesnt exist or has been verified already. Please sign up or log in"
                res.redirect('/user/verified/error=true&message=${message}')
            }
        })
        .catch((error) => {
            console.log(error)
            let message = " An error has occured while checking for existing user verification record"
            res.redirect('/user/verified/error=true&message=${message}')
        })

    })

    register.get("/verified", (res,req) => {
        res.sendFile(path.join(_dirname, "./../views/verified.html"))//might need to change
    })
