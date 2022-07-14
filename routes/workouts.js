const express = require('express')
const { get } = require('mongoose')
const {
    createWorkout,
    getWorkouts,
    getWorkout,
    getExercise,
    createStats,
    deleteWorkout,
    updateWorkout,
    searchExercises
} = require('../controllers/workoutControllers')

const statsImport = require('../models/StatsModel')
const { create } = require('../models/WorkoutsModel')
const workoutImport = require('../models/WorkoutsModel')

const router = express.Router()

//get all workouts <------------------  working function *************
router.get('/all/:id', getWorkouts)

//get a single workout <------------------  working function *************
router.get('/:id', getWorkout)

//create workout <------------------  working function *************
router.post('/', createWorkout)

//get a single exercise <------------------  working function *************
router.get('/:workoutID/:id', getExercise)

//post a new stat    <------------------  working function *************
// allows identical stats 7-2-22
router.post('/:workoutID/:id', createStats)

//delete a workout <------------------  working function *************
router.delete('/:id', deleteWorkout)

//update a workout <------------------  working function *************
router.patch('/:id', updateWorkout)

//search exercises
//router.get('/search/:workoutID', searchExercises)

module.exports = router 
