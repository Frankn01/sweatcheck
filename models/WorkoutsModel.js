const { ObjectId } = require('mongodb')
const mongoose = require('mongoose')

const Schema = mongoose.Schema

// schema posts to mongodb in the order it is below
const workoutsSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    userID: {
        type: ObjectId,
        required: true
    },
    userEXERCISES: 
        [{type: ObjectId}]
    
}, { versionKey: false })
// ,{ timestamp: true }

// the name you send below is the name that the collection will be called
var collectionName = 'Workouts'
module.exports = mongoose.model('Workout',workoutsSchema,collectionName)

