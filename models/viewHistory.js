const mongoose = require('mongoose')
const Schema = mongoose.Schema

const viewHistory = new Schema({
    _id: Schema.ObjectId,
    ID:  String,
    Title: String,
    Tags:  Array, 
    Site: String,
    Date: Date,
    UserID: String
  })
  
const viewHistoryModel = mongoose.model('viewhistories', viewHistory)

module.exports = viewHistoryModel