const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
    message: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});

const MessageModel = mongoose.model('Message', MessageSchema); //namespace/collection

module.exports = MessageModel;