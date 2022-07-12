const { ObjectId } = require('mongodb')
const mongoose = require('mongoose')

const Schema = mongoose.Schema

const exerciseSchema = new Schema({
    name:{
        type: String,
        required: true
    },
    musclegroup: {
        type: String,
        required: true
    }
}, { versionKey: false })
// ,{ timestamp: true }

// the name you send below is the name that the collection will be called
var collectionName = 'Exercises'
module.exports = mongoose.model('Exercises',exerciseSchema,collectionName)

