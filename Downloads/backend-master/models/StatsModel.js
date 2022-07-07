const mongoose = require('mongoose')

const Schema = mongoose.Schema

const statsSchema = new Schema({
    reps: {
        type: Number,
        required: true
    },
    sets:{
        type: Number,
        required: true
    },
    weight: {
        type: Number,
        required: true
    }, 
    workout: {
        type: String,
        required: true
    }
}, { versionKey: false })
// ,{ timestamp: true }

// the name you send below is the name that the collection will be called
var collectionName = 'Stats'
module.exports = mongoose.model('Stat',statsSchema,collectionName)

