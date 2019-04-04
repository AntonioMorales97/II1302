const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../config/auth');

//Get locations to build website!
//Location model
const Location = require('../models/Location');

// Welcome Page
router.get('/', (req, res) => res.render('welcome'));

// Dashboard
router.get('/dashboard', ensureAuthenticated, (req, res) => {
  Location.findOne({ current: true })
  .then(location => {
    if(!location){
      res.render('dashboard', {
        name: req.user.name,
        currentLocation: 'Could not find any current location!'
      });
    }
    const message = location.message;
    res.render('dashboard', {
      name: req.user.name,
      currentLocation: message
    });
  })
  .catch(err => {
    res.render('dashboard', {
      name: req.user.name,
      currentLocation: err.message
    });
  });
  /*
  res.render('dashboard', {
    name: req.user.name
  });
  */
});

module.exports = router;