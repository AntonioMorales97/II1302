const mongoose = require('mongoose');
const assert = require('chai').assert;

// DB Config
const db = require('../config/keys').MongoURI;

describe('MongoDB Connection', function() {
    it('Checking Connection...', function() {
        return mongoose.connect(db, { useNewUrlParser: true, useFindAndModify: false })
        .then(assert.isOk("OK", "OK"))
        .catch(err => assert.fail(err.message))
    });
});