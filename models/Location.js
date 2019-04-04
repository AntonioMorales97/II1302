const mongoose = require('mongoose');

const LocationSchema = new mongoose.Schema({
    message: {
        type: String,
        required: true
    },
    current: {
        type: Boolean,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});

const Location = mongoose.model('Location', LocationSchema); //namespace/collection

module.exports = Location;