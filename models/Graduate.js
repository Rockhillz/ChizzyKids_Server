const mongoose = require("mongoose");

const graduateSchema = new mongoose.Schema({
  name: String,
  graduationYear: Number,
  formerClassroom: String, 
  otherDetails: String, 
});

module.exports = mongoose.model("Graduate", graduateSchema);