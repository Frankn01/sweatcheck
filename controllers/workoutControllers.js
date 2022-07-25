const Workout = require('../models/WorkoutsModel')
const Exercises = require('../models/ExerciseModel')
const Stats = require('../models/StatsModel')
const mongoose = require('mongoose')
const {ObjectId} = require('mongodb')

function toTitleCase(str) {
    return str.replace(
      /\w\S*/g,
      function(txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
      }
    );
  }

// get all workouts
const getWorkouts = async (req, res) => {
    const userID = req.user.userId
    const workouts = await Workout.find({userID: userID}).sort({createdAt: -1})

    res.status(200).json(workouts)
}

// get a single workout
const getWorkout = async (req, res) => {
    const { workoutID } = req.params
    const userID = req.user.userId
    
    if (!mongoose.Types.ObjectId.isValid(workoutID)){
        return res.status(404).json({error: 'No such workout'})
    }

    const workout = await Workout.findOne({_id: workoutID, userID: userID})

    if(!workout) {
        return res.status(404).json({error: 'No such workout'})
    }

    res.status(200).json({workout})
}

// get an Exercise

const getExercise = async (req, res) => {
    const { workoutID, exerciseID  } = req.params
    const userID = req.user.userId

    if (!mongoose.Types.ObjectId.isValid(exerciseID)){
        return res.status(404).json({error: 'No such exercise'})
    }

    const exercise = await Exercises.findOne({_id: exerciseID, userID: userID})
 
    if(!exercise) {
        return res.status(404).json({error: 'No such exercise'})
    }

    res.status(200).json(exercise)
}

const getStats = async (req, res) => {
    // const { userID } = req.params
    const userID = req.user.userId

    const stats = await Stats.find({userID: userID}).sort({createdAt: -1})

    res.status(200).json(stats)
}

// create new workout
const createWorkout = async (req, res) => {
    const {name, userEXERCISES} = req.body
    const userID = req.user.userId

    try {
        const workout = await Workout.create({name, userID, userEXERCISES})
        res.status(200).json(workout)
    }   catch (error)   {
        res.status(400).json({error: error.message})
    }
}

const getStat = async (req, res) => {
    const { statID  } = req.params
    const userID = req.user.userId

    if (!mongoose.Types.ObjectId.isValid(statID)){
        return res.status(404).json({error: 'No such stat'})
    }

    const stat = await Stats.findOne({_id: statID, userID: userID})
 
    if(!stat) {
        return res.status(404).json({error: 'No such stat'})
    }

    res.status(200).json(stat)
}

const getExeStats = async (req, res) => {
    const { exerciseID } = req.params
    const userID = req.user.userId

    if (!mongoose.Types.ObjectId.isValid(exerciseID)){
        return res.status(404).json({error: 'No such exercise'})
    }

    const exeStats = await Stats.find({exerciseID: exerciseID, userID: userID}).sort({createdAt: -1})

    if (!exerciseID){
        return res.status(404).json({error: 'No such exercise'})
    }

    res.status(200).json(exeStats)
}

// delete a workout
const deleteWorkout = async (req, res) =>{
    const { workoutID } = req.params
    const userID = req.user.userId
    
    if (!mongoose.Types.ObjectId.isValid(workoutID)){
        return res.status(404).json({error: 'No such workout'})
    }

    const workout = await Workout.findOneAndDelete({_id: workoutID, userID: userID})

    if(!workout) {
        return res.status(404).json({error: 'No such workout'})
    }

    res.status(200).json({workout})
}

// update a workout
const updateWorkout = async (req, res) =>{
    const { workoutID } = req.params
    const userID = req.user.userId
    
    if (!mongoose.Types.ObjectId.isValid(workoutID)){
        return res.status(404).json({error: 'No such workout'})
    }

    const workout = await Workout.findOneAndUpdate({_id: workoutID, userID: userID}, {
    ...req.body
    })

    if(!workout) {
        return res.status(404).json({error: 'No such workout'})
    }

    res.status(200).json({workout})
}

// add stats to an exercise
const createStats = async (req, res) =>{
    const {workoutID, exerciseID} = req.params
    const {reps, sets, weight, createdAt} = req.body
    const userID = req.user.userId

    try {
        const newStats = await Stats.create({reps, sets, weight, exerciseID: exerciseID, userID, createdAt: Date.now()});
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
    const {key} = req.params;
    let data = await Exercises.find({
        "$or": [
            {name:{$regex: req.params.key, $options: 'i'}}
        ]
    })
    res.send(data)
}

const blankSearch = async (req, res, next) => {
    let data = await Exercises.find({}).sort({createdAt: -1})
    res.send(data)
}


module.exports = {
    getWorkouts,
    getWorkout,
    getExercise,
    getStats,
    getStat,
    getExeStats,
    deleteWorkout,
    updateWorkout,
    createWorkout,
    createStats,
    searchExercises,
    blankSearch
}
