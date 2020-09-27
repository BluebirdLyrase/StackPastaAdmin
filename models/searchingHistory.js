const mongoose = require('mongoose')
const Schema = mongoose.Schema

const searchingHistory = new Schema({
    _id: Schema.ObjectId,
    Order:  String,
    Site: String,
    Tagged:  String, 
    "Sort By": String,
    UserID: String,
    "Search Text": String,
    Date: Date
  })
  
const searchingHistoryModel = mongoose.model('searchinghistories', searchingHistory)

module.exports = searchingHistoryModel