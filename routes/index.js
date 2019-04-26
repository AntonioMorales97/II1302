const express = require('express');
const router = express.Router();
//const { ensureAuthenticated } = require('../config/auth');

//Message model
const Message = require('../models/Message');

// Welcome Page
router.get('/', (req, res) => {
  Message.findOne().sort({date: -1})
  .then(message => {
    if(!message){
      res.render('welcome', {
        message: 'Could not find message!'
      });
    } else{
      res.render('welcome', {
        message: message.message
      });
    }
  })
  .catch(err => {
    console.log(err);
  });
});

module.exports = router;