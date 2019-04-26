const expect = require('chai').expect;
const User = require('../../models/User');

var user;

describe('User', function() {
    before(function() {
        user = new User();
    })

    it('Invalid if name field empty', function(done) {
        user.validate(function(err) {
            expect(err.errors.name).to.exist;
            done();
        });
    });

    it('Invalid if email field empty', function(done) {
        user.validate(function(err) {
            expect(err.errors.email).to.exist;
            done();
        });
    });

    it('Invalid if password field empty', function(done) {
        user.validate(function(err) {
            expect(err.errors.password).to.exist;
            done();
        });
    });
});