const mongoose = require('mongoose');

const newSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },

    content: {
        type: String,
        required: true,
    },

    date: {
        type: Date,
        default: Date.now,
        required: true,
    }
})

module.exports = mongoose.model('New', newSchema);