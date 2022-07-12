const Workout = require('../models/WorkoutsModel')
const Exercises = require('../models/ExerciseModel')
const Stats = require('../models/StatsModel')
const mongoose = require('mongoose')
const {ObjectId} = require('mongodb')

// get all workouts
const getWorkouts = async (req, res) => {
    const { id } = req.params
    const userID = id
    const workouts = await Workout.find({userID}).sort({createdAt: -1})

    res.status(200).json(workouts)
}

// get a single workout
const getWorkout = async (req, res) => {
    const { id } = req.params
    
    if (!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({error: 'No such workout'})
    }

    const workout = await Workout.findById(id)

    if(!workout) {
        return res.status(404).json({error: 'No such workout'})
    }

    res.status(200).json({workout})
}

const getExercise = async (req, res) => {
    const { workoutID, id  } = req.params

    if (!mongoose.Types.ObjectId.isValid(workoutID)){
        return res.status(404).json({error: 'No such workout'})
    }

    if (!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({error: 'No such exercise'})
    }

    const workout = await Workout.findById(workoutID)
    const exercise = await Exercises.find({workoutID: workoutID, _id: id})

    if(!workout) {
        return res.status(404).json({error: 'No such workout'})
    }
 
    if(!exercise) {
        return res.status(404).json({error: 'No such exercise'})
    }

    res.status(200).json(exercise)
}

// create new workout
const createWorkout = async (req, res) => {
    const {name, userID, userEXERCISES} = req.body

    //why am i sending these
    //const exercises = await Exercises.find({})
    //console.log(exercises)

    try {
        const workout = await Workout.create({name, userID, userEXERCISES})
        res.status(200).json(workout)
    }   catch (error)   {
        res.status(400).json({error: error.message})
    }
}

// delete a workout
const deleteWorkout = async (req, res) =>{
    const { id } = req.params
    
    if (!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({error: 'No such workout'})
    }

    const workout = await Workout.findByIdAndDelete(id)
    //const exercises = await Exercises.find({workoutID: id})

    if(!workout) {
        return res.status(404).json({error: 'No such workout'})
    }

    res.status(200).json({workout})
}

// update a workout
const updateWorkout = async (req, res) =>{
    const { id } = req.params
    
    if (!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({error: 'No such workout'})
    }

    const workout = await Workout.findOneAndUpdate({_id: id}, {
    ...req.body
    })

    if(!workout) {
        return res.status(404).json({error: 'No such workout'})
    }

    res.status(200).json({workout})
}

// add stats to an exercise
const createStats = async (req, res) =>{
    const {workoutID, id} = req.params
    const {reps, sets, weight, exerciseID} = req.body

    try {
        const newStats = await Stats.create({reps, sets, weight, exerciseID: id})
        res.status(200).json(newStats)
    } catch (error) {
        res.status(400).json({error: error.message})
    }
}

// add exercise

//search exercise

module.exports = {
    getWorkouts,
    getWorkout,
    getExercise,
    deleteWorkout,
    updateWorkout,
    createWorkout,
    createStats
}