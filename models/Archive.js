const mongoose = require("mongoose");

const archiveSchema = new mongoose.Schema({
  termId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Term" 
},

  type: { 
    type: String, 
    enum: ["Mark", "Attendance"], 
    required: true 
},

  data: { 
    type: mongoose.Schema.Types.Mixed, 
    required: true 
}, // Stores the actual data

  archivedAt: { 
    type: Date, 
    default: Date.now 
}, // Timestamp for when the data was archived
});

module.exports = mongoose.model("Archive", archiveSchema);
