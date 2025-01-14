const mongoose = require('mongoose');

const termSchema = mongoose.Schema({
    termName: {
        type: String,
        enum: ['First Term', 'Second Term', 'Third Term'],
        required: true,
    },

    session: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Session',
        required: true,
    },

    startDate: {
        type: Date,
        required: true,
    },

    endDate: {
        type: Date,
        required: true,
    },

    isCurrentTerm: {
        type: Boolean,
        default: false,
    }
}, { timestamps: true })

module.exports = mongoose.model('Term', termSchema);