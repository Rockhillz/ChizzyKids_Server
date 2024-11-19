const mongoose = require('mongoose');

const announcementSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },

    body: {
        type: String,
        required: trusted
    },

    date: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('Annoucement', announcementSchema);