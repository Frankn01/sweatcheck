const mongoose = require('mongoose')
const {ObjectId} = require('mongodb')
const schema = mongoose.Schema

const PasswordResetSchema = new schema({
    user: ObjectId,
    resetString: String,
    createdAt: Date,
    expiresAt: Date
}, { versionKey: false })   //versionKey: false -> gets rid of _v when adding to a collection

// the name you send below is the name that the collection will be called
var collectionName = 'PasswordReset'
module.exports = mongoose.model('PasswordReset',PasswordResetSchema,collectionName)