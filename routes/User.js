const express = require('express');
const router = express.Router();

// mongodb user model
const User = require('../models/UsersModel');

// Password handler
const bcrypt = require('bcrypt');

//Register
router.post('/signup', (reg, res) => {
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
                bcrypt.hash(password, saltRounds).then(hashedPassword => {
                    const newUser = new User({
                        firstName,
                        lastName,
                        email,
                        login,
                        password: hashedPassword
                    });

                    newUser.save().then(result => {
                        res.json({
                            status: "SUCCESS",
                            message: "User was successfully created!",
                            data: result,
                        })
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
            if (data) {
                //user exist

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