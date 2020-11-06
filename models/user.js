const mongoose = require('mongoose')
const Schema = mongoose.Schema

const user = new Schema({
    _id: Schema.ObjectId,
    Password:  String,
    UserID: String,
    type: String,
    available: Boolean
  })
  
const userModel = mongoose.model('users', user)

module.exports = userModel