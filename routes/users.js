const express = require('express');
const router = express.Router();
//const bcrypt = require('bcryptjs');
const passport = require('passport');
//const key = require('../config/keys').SECRET_KEY;

// User model and service
const UserModel = require('../models/user_model');
const UserService = require('../models/user_services');
const userService= UserService(UserModel);

// Login Page
router.get('/login', (req, res) => res.status(200).render('login'));

// Register Page
router.get('/register', (req, res) => res.status(200).render('register'));

// Register Handle
router.post('/register', async (req, res) => {
    //try{
        await userService.registerUser(req,res).then(() => {
            req.flash('success_msg', 'You are now registered and can log in!');
            res.status(200).redirect('/users/login');
        }).catch(e => {
            const {name, email, password, password2, secretKey} = req.body;
            res.status(400).render('register', { errors: e.errors, 
                                            name,
                                            email,
                                            password,
                                            password2,
                                            secretKey });
        })/*
        req.flash('success_msg', 'You are now registered and can log in!');
        res.status(200).redirect('/users/login');
        
    }catch(e) {
        const {name, email, password, password2, secretKey} = req.body;
        res.status(400).render('register', { errors: e.errors, 
                                            name,
                                            email,
                                            password,
                                            password2,
                                            secretKey });
    }*/
    /*
    const { name, email, password, password2, secretKey } = req.body;
    let errors = [];

    //Check required fields
    if(!name || !email || !password || !password2) {
        errors.push({ msg: 'Please fill in all fields!'});
    }

    //Check passwords match
    if(password !== password2) {
        errors.push({ msg: 'Passwords do not match!'});
    }

    //Check pass length
    if(password.length < 6){
        errors.push({ msg: 'Password need to be at least 6 characters'});
    }

    if(secretKey !== key){
        errors.push({msg: 'Wrong secret key!'});
    }

    if(errors.length > 0){
        res.status(400).render('register', {
            errors,
            name,
            email,
            password,
            password2,
            secretKey
        });
    } else {
        // Validation passed
        User.findOne( { email: email})
        .then(user => {
            if(user){
                // User already exists
                errors.push({ msg: 'Email is already registered'})
                res.status(400).render('register', {
                    errors,
                    name,
                    email,
                    password,
                    password2
                });
            } else {
                const newUser = new User({
                    name,
                    email,
                    password
                });

                // Hash Password
                bcrypt.genSalt(10, (err, salt) => 
                    bcrypt.hash(newUser.password, salt, (err, hash) => {
                        if (err) throw err;
                        // Set password to hashed
                        newUser.password = hash;
                        //Save user
                        newUser.save()
                        .then(user => {
                            req.flash('success_msg', 'You are now registered and can log in!');
                            res.status(200).redirect('/users/login')
                        })
                        .catch(err => console.log(err));
                }))
            }
        }); 
    } */
});

// Login handle
router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/dashboard',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req, res, next);
});

// Logout handle
router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success_msg', 'You are logged out!');
    res.redirect('/users/login');
})

module.exports = router;