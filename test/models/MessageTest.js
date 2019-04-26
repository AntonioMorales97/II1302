const expect = require('chai').expect;
const Message = require('../../models/Message');

describe('Message', function() {
    it('Invalid if message field empty', function(done) {
        let msg = new Message();
 
        msg.validate(function(err) {
            expect(err.errors.message).to.exist;
            done();
        });
    });
});