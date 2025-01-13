const mongoose = require('mongoose');

const sessionSchema = mongoose.Schema({
    sessionName: { 
        type: String, 
        required: true, 
        unique: true 
    },

    isCurrentSession: { type: Boolean, default: false },

});


module.exports = mongoose.model('Session', sessionSchema);
