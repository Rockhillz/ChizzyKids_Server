const mongoose = require('mongoose');

const academicYearSchema = mongoose.Schema({
    year: { 
        type: String, 
        required: true, 
        unique: true 
    },
    
    terms: [
      {
        name: { type: String, enum: ['First Term', 'Second Term', 'Third Term'], required: true },
        startDate: { type: Date, required: true },
        endDate: { type: Date, required: true },
        isActive: { type: Boolean, default: false },
      },
    ],

    isActive: { type: Boolean, default: false },
    isArchived: { type: Boolean, default: false }
});


module.exports = mongoose.model('AcademicYear', academicYearSchema);
