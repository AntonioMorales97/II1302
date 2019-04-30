const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../config/auth');

//Message model and service
const MessageModel = require('../models/message_model');
const MessageService = require('../models/message_services');
const messageService = MessageService(MessageModel);

// Dashboard
router.get('/', ensureAuthenticated, async (req, res) => {
  const message = await messageService.getLatestMessage();
  if(!message){
    res.status(204).render('dashboard', {
      name: req.user.name,
      message: 'Could not find message!'
    });
  } else{
    res.status(200).render('dashboard', {
      name: req.user.name,
      message: message.message
    });
  }
  /*
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
  */
});

router.post('/message', ensureAuthenticated, async (req, res) => {
  const message = await messageService.enterMessage(req.body.message);
  if(message){
    res.render('dashboard', {
      name: req.user.name,
      message: message.message
    });
  } else{
    console.log('Something went wrong when posting message. Message is: ' + message); //should not come here
  }
  /*
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
  */
});

module.exports = router;