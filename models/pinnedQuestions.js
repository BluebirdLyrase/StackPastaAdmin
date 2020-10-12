const mongoose = require('mongoose')
const Schema = mongoose.Schema

const pinnedQuestions = new Schema({
    _id: Schema.ObjectId,
    ID:  String,
    Title: String,
    Site: String,
    pinText:String,
    Date: Date,
    UserID: String
  })
  
const pinnedQuestionsModel = mongoose.model('pinnedQuestions', pinnedQuestions)

module.exports = pinnedQuestionsModel