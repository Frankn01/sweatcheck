const express = require('express')
const { default: mongoose } = require('mongoose')
const usersImport = require('../models/UsersModel')

const register = express.Router()

//register a new user    <------------------  working function *************
register.post('/', async (req, res) =>{
    const {first,last,username,password} = req.body
     // try catch statement for finding if the user exists
    try {
        const user = await usersImport.findOne({login:username,password:password,firstName:first,lastName:last})
        if(user){
            res.status(409).json({msg: 'User already exists'})
        }else{
            //try catch statement for creating the new user
            try{
                const newUser = usersImport.create({login:username,password:password,firstName:first,lastName:last})
                res.status(200).json({msg: 'User was created'})
            }catch(error) {
                res.status(400).json({error: error.message})
            }}} catch (error) {
        res.status(400).json({error: error.message})
    }})

module.exports = register
