const assert = require('chai').assert;
const request = require('supertest');
const app = require('../app');
const mongoose = require('mongoose');
const mongoDB = require('../config/keys').MONGO_URI;
const secretKey = require('../config/keys').SECRET_KEY;
const bcrypt = require('bcryptjs');

mongoose.connect(mongoDB, { useNewUrlParser: true, useFindAndModify: false });

const User = mongoose.model('User');

describe('App test', () => {
    it('has a module', () => {
        assert.isDefined(app, 'app is defined');
    });
    
    const testName = 'test';
    const testEmail = 'test@test.test';
    const testDiffEmail = 'test1@test.test';
    const testFailEmail = 'fail@fail.fail';
    const testPassword = '123456';
    const testDiffPassword = '12345678';
    const testShortPassword = '123';
    const wrongSecretKey = 'abc123';

    let server;

    before(done => {
        server = app.listen(5000);
        var user = new User({ name: testName, email: testEmail, password: testPassword });
        bcrypt.genSalt(10, (err, salt) => 
                    bcrypt.hash(user.password, salt, (err, hash) => {
                        if (err) throw err;
                        // Set password to hashed
                        user.password = hash;
                        //Save user
                        user.save()
                        .then(user => {
                            done();
                        })
                        .catch(err => console.log(err));
                }));
    });

    after(async() => {
        await User.deleteOne({ name: testName, email: testEmail });
        await mongoose.connection.close();
        server.close();
    });

    describe('Testing routes', () => {
        it('can render welcome page', async () => {
            await request(server).get('/').expect(200);
        });

        it('can route to login', async () => {
            await request(server).get('/users/login').expect(200);
        });

        it('can route to register', async () => {
            await request(server).get('/users/register').expect(200);
        });

        it('fails if route to only "/users" ', async () => {
            await request(server).get('/users').expect(404);
        });

        it('route for hardware returns json', async () => {
            await request(server).get('/hardware').expect('Content-type', /json/)
            .expect(200);
        });

        it('should route to login page when trying to route "/dashboard" unauthenticated', async () => {
            await request(server).get('/dashboard').expect('Location', '/users/login');
        });
    });

    describe('User handling test', () => {
        before(async () => {
            await User.deleteOne({ name: testName, email: testDiffEmail });
        });

        after(async () => {
          await User.deleteOne({ name: testName, email: testDiffEmail });
        });

        describe('User register test', () => {
            it('should fail if some field is missing', async () => {
                await request(server).post('/users/register')
                .send({ name: "", email: "", password: "", password2: "", secretKey: "" })
                .expect(400);
            });

            it('should fail if passwords are too short', async () => {
                await request(server).post('/users/register')
                .send({ name: testName, email: testEmail, password: testShortPassword, password2: testShortPassword, secretKey: secretKey })
                .expect(400);
            });

            it('should fail if passwords do not match', async () => {
                await request(server).post('/users/register')
                .send({ name: testName, email: testEmail, password: testPassword, password2: testDiffPassword, secretKey: secretKey })
                .expect(400);
            });

            it('should fail if wrong secret key', async () => {
                await request(server).post('/users/register')
                .send({ name: testName, email: testEmail, password: testPassword, password2: testPassword, secretKey: wrongSecretKey })
                .expect(400);
            });

            it('should fail if email already registered', async () => {
                await request(server).post('/users/register')
                .send({ name: testName, email: testEmail, password: testPassword, password2: testPassword, secretKey: secretKey })
                .expect(400);
            });

            it('should redirect to "users/login" when register successful', async () => {
                await request(server).post('/users/register')
                .send({ name: testName, email: testDiffEmail, password: testPassword, password2: testPassword, secretKey: secretKey })
                .expect('Location', '/users/login');
                
                await User.deleteOne({ name: testName, email: testDiffEmail });
            });
        });

        describe('User login test', () => {
            it('should redirect to login page when email does not exist', async () => {
                await request(server).post('/users/login')
                .send({ email: testFailEmail, password: testPassword })
                .expect('Location', '/users/login');
            });

            it('should redirect to login page when the password is wrong', async () => {
                await request(server).post('/users/login')
                .send({ email: testEmail, password: testDiffPassword })
                .expect('Location', '/users/login');
            });

            it('should redirect to dashboard page when login successful', async () => {
                await request(server).post('/users/login')
                .send({ email: testEmail, password: testPassword })
                .expect('Location', '/dashboard');
            });
        });
        
    });
});