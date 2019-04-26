const assert = require('chai').assert;
const db = require('../../config/keys').MongoURI;

describe('Keys', () => {
    it('Checking MongoURI...', () => {
        assert.equal(db, 'mongodb+srv://ii1302:ii1302@ii1302cluster-olj2m.azure.mongodb.net/ii1302?retryWrites=true');
    });
});

