const express = require('express')
const { default: mongoose } = require('mongoose')
const usersImport = require('../models/UsersModel')

const login = express.Router()

//post a new workout    <------------------  working function *************
login.post('/', async (req, res) =>{
    const {username,password} = req.body
     
    try {
        const user = await usersImport.findOne({login:username,password:password})
        if(user){
            res.status(200).json(user)
        }
        else{
            res.status(404).json({msg: 'User not found'})
        }
        
    } catch (error) {
        res.status(400).json({error: error.message})
    }
})

module.exports = login 
