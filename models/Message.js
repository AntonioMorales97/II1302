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

/*
MessageSchema.statics.getLatest = function() {
    return this.model('Message').findOne().sort({date: -1});
};
*/

const Message = mongoose.model('Message', MessageSchema); //namespace/collection

module.exports = Message;