const express = require('express')
const { get } = require('mongoose')
const {
    createWorkout,
    getWorkouts,
    getWorkout,
    getExercise,
    createStats,
    deleteWorkout,
    updateWorkout
} = require('../controllers/workoutControllers')

const statsImport = require('../models/StatsModel')
const { create } = require('../models/WorkoutsModel')
const workoutImport = require('../models/WorkoutsModel')

const router = express.Router()

//get all workouts <------------------  working function *************
router.get('/all/:id', getWorkouts)

//get a single workout
router.get('/:id', getWorkout)

//create workout
router.post('/', createWorkout)

//get a single exercise
router.get('/:workoutID/:id', getExercise)

//post a new stat    <------------------  working function *************
// allows identical stats 7-2-22
router.post('/:workoutID/:id', createStats)

//delete a workout
router.delete('/:id', deleteWorkout)

//update a workout
router.patch('/:id', updateWorkout)

module.exports = router 
