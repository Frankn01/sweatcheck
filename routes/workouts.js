const express = require('express')
const { get } = require('mongoose')
const {
    createWorkout,
    getWorkouts,
    getWorkout,
    getExercise,
    getExercises,
    getStats,
    getStat,
    getExeStats,
    createStats,
    deleteWorkout,
    updateWorkout,
    searchExercises,
    blankSearch
} = require('../controllers/workoutControllers')

const statsImport = require('../models/StatsModel')
const { create } = require('../models/WorkoutsModel')
const workoutImport = require('../models/WorkoutsModel')
const verifyToken = require('../middleware/authentication')

const router = express.Router()

//get all workouts <------------------  working function *************
router.get('/all', verifyToken, getWorkouts)    // can get rid of userID in url

//get all stats <------------------  working function *************
router.get('/all/stats', verifyToken, getStats)

//get all exercises
router.get('/all/exercises', verifyToken, getExercises)

//get a single stat
router.get('/stats/:statID', verifyToken, getStat)

//get all stats for a certain exercise
router.get('/all/stats/:exerciseID', verifyToken, getExeStats)

//search exercises
router.get('/search', verifyToken, blankSearch)
router.get('/search/:key', verifyToken, searchExercises)

//get a single workout <------------------  working function *************
router.get('/:workoutID', verifyToken, getWorkout)

//create workout <------------------  working function *************
router.post('/', verifyToken, createWorkout)

//get a single exercise <------------------  working function *************
router.get('/:workoutID/:exerciseID', verifyToken, getExercise)

//post a new stat    <------------------  working function *************
// allows identical stats 7-2-22
router.post('/stats/:exerciseID', verifyToken, createStats)

//delete a workout <------------------  working function *************
router.delete('/:workoutID', verifyToken, deleteWorkout)

//update a workout <------------------  working function *************
router.patch('/:workoutID', verifyToken, updateWorkout)

module.exports = router 
