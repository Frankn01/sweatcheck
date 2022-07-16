const Workout = require('../models/WorkoutsModel')
const Exercises = require('../models/ExerciseModel')
const Stats = require('../models/StatsModel')
const mongoose = require('mongoose')
const {ObjectId} = require('mongodb')

// get all workouts
const getWorkouts = async (req, res) => {
    const { userID } = req.params

    const workouts = await Workout.find({userID: userID}).sort({createdAt: -1})

    res.status(200).json(workouts)
}

// get a single workout
const getWorkout = async (req, res) => {
    const { workoutID } = req.params
    
    if (!mongoose.Types.ObjectId.isValid(workoutID)){
        return res.status(404).json({error: 'No such workout'})
    }

    const workout = await Workout.findById(workoutID)

    if(!workout) {
        return res.status(404).json({error: 'No such workout'})
    }

    res.status(200).json({workout})
}

// get an Exercise

const getExercise = async (req, res) => {
    const { workoutID, exerciseID  } = req.params

    if (!mongoose.Types.ObjectId.isValid(exerciseID)){
        return res.status(404).json({error: 'No such exercise'})
    }

    const exercise = await Exercises.find({_id: exerciseID})
 
    if(!exercise) {
        return res.status(404).json({error: 'No such exercise'})
    }

    res.status(200).json(exercise)
}

const getStats = async (req, res) => {
    const { userID } = req.params

    const stats = await Stats.find({userID: userID}).sort({createdAt: -1})

    res.status(200).json(stats)
}

// create new workout
const createWorkout = async (req, res) => {
    const {name, userID, userEXERCISES} = req.body

    try {
        const workout = await Workout.create({name, userID, userEXERCISES})
        res.status(200).json(workout)
    }   catch (error)   {
        res.status(400).json({error: error.message})
    }
}

const getStat = async (req, res) => {
    const { statID  } = req.params

    if (!mongoose.Types.ObjectId.isValid(statID)){
        return res.status(404).json({error: 'No such exercise'})
    }

    const stat = await Stats.find({_id: statID})
 
    if(!stat) {
        return res.status(404).json({error: 'No such exercise'})
    }

    res.status(200).json(stat)
}

// delete a workout
const deleteWorkout = async (req, res) =>{
    const { workoutID } = req.params
    
    if (!mongoose.Types.ObjectId.isValid(workoutID)){
        return res.status(404).json({error: 'No such workout'})
    }

    const workout = await Workout.findByIdAndDelete(workoutID)

    if(!workout) {
        return res.status(404).json({error: 'No such workout'})
    }

    res.status(200).json({workout})
}

// update a workout
const updateWorkout = async (req, res) =>{
    const { workoutID } = req.params
    
    if (!mongoose.Types.ObjectId.isValid(workoutID)){
        return res.status(404).json({error: 'No such workout'})
    }

    const workout = await Workout.findOneAndUpdate({_id: workoutID}, {
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
    const {reps, sets, weight, exerciseID, userID} = req.body

    try {
        const newStats = await Stats.create({reps, sets, weight, exerciseID: id, userID})
        res.json({
            status: "SUCCESS",
            message: "Stats were successfully created!",
            data: newStats
        })
    } catch (error) {
        res.status(400).json({error: error.message})
    }
}

// search exercise
const searchExercises = async (req, res, next) => {
    const filters = req.query;
    console.log(filters)
    const filteredUsers = await Exercises.filter(user => {
    let isValid = true;
    for (key in filters) {
      console.log(key, user[key], filters[key]);
      isValid = isValid && user[key] == filters[key];
    }
    return isValid;
  }).clone().catch(function(err){console.log(err)});
  res.send("filteredUsers");
}


module.exports = {
    getWorkouts,
    getWorkout,
    getExercise,
    getStats,
    getStat,
    deleteWorkout,
    updateWorkout,
    createWorkout,
    createStats,
    searchExercises
}