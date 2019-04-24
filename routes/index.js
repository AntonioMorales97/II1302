const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../config/auth');

//Get locations to build website!
//Message model
const Message = require('../models/Message');

// Welcome Page
router.get('/', (req, res) => res.render('welcome'));

// Dashboard
router.get('/dashboard', ensureAuthenticated, (req, res) => {
  Message.findOne().sort({date: -1})
  .then(location => {
    if(!location){
      res.render('dashboard', {
        name: req.user.name,
        currentLocation: 'Could not find any current location!'
      });
    } else{
      const message = location.message;
      res.render('dashboard', {
        name: req.user.name,
        currentLocation: message
      });
    }
  })
  .catch(err => {
    console.log(err);
  });
});


module.exports = router;