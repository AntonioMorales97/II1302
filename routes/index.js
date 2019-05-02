const express = require("express");
const router = express.Router();
//const { ensureAuthenticated } = require('../config/auth');

//Message model and service
const MessageModel = require("../models/message_model");
const MessageService = require("../models/message_services");
const messageService = MessageService(MessageModel);

// Welcome Page
router.get("/", async (req, res) => {
    const latestMessage = await messageService.getLatestMessage();
    if (!latestMessage) {
        res.status(204).render("welcome", {
            message: "Could not find message!"
        });
    } else {
        res.status(200).render("welcome", {
            latestMessage: latestMessage.message
        });
    }

    /*
  Message.findOne().sort({date: -1})
  .then(message => {
    if(!message){
      res.status(204).render('welcome', {
        message: 'Could not find message!'
      });
    } else{
      res.status(200).render('welcome', {
        message: message.message
      });
    }
  })
  .catch(err => {
    console.log(err);
  });
  */
});

module.exports = router;
