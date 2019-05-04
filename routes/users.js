const express = require('express');
const router = express.Router();
const passport = require('passport');

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
    await userService.registerUser(req,res)
    .then(() => {
        req.flash('success_msg', 'You are now registered and can log in!');
        res.status(200).redirect('/users/login');
    })
    .catch(e => {
        const {name, email, password, password2, secretKey} = req.body;
        res.status(400).render('register', { errors: e.errors, 
                                            name,
                                            email,
                                            password,
                                            password2,
                                            secretKey });
    })
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
});

module.exports = router;