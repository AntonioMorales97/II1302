const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../config/auth');
//Message model
const Message = require('../models/Message');

// Dashboard
router.get('/', ensureAuthenticated, (req, res) => {
  Message.findOne().sort({date: -1})
  .then(message => {
    if(!message){
      res.render('dashboard', {
        name: req.user.name,
        message: 'Could not find message!'
      });
    } else{
      res.render('dashboard', {
        name: req.user.name,
        message: message.message
      });
    }
  })
  .catch(err => {
    console.log(err);
  });
});

router.post('/message', ensureAuthenticated, (req, res) => {
  const  message  = req.body.message;
  Message.findOneAndUpdate({ message: message}, { $set: { date: Date.now() }}, { new: true })
  .then(foundMessage => {
    if(foundMessage){
        res.render('dashboard', {
            name: req.user.name,
            message: foundMessage.message
        });
    } else {
        //enter new message...!
        //console.log("Not found, creating new message");
        const newMessage = new Message({
            message: message,
            date: Date.now()
        })
        newMessage.save()
        .then( message => {
            res.render('dashboard', {
                name: req.user.name,
                message: message.message
            });
        }).catch(err => console.log(err));    
    }  
  }).catch(err => {
    console.log(err);
  });
});

module.exports = router;