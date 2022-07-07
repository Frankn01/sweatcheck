require('dotenv').config()

const express = require('express')
const workoutRoutes = require('./routes/workouts')
const loginRoutes = require('./routes/login')
const registerRoutes = require('./routes/register')
const userRoutes = require('./routes/User')

const path = require('path')
const mongoose  = require('mongoose')
const app = express() //express app

//middleware
app.use(express.json())
app.use((req,res,next) => {
    console.log(req.path, req.method)
    next()
})

//routes
app.use('/api/workouts',workoutRoutes)
app.use('/api/login',loginRoutes)
app.use('/api/register',registerRoutes)
app.use('/api/user',userRoutes)



//connect using mongoose
const conn = mongoose.connect(process.env.MONGO_URI)
.then(()=>{ 
    app.listen(process.env.PORT, ()=>{
        console.log('connected to db & listening on port',process.env.PORT)
    })
})
.catch((error)=>{
    console.log(error)
})
