//This is where the hardware will connect
const express = require('express');
const router = express.Router();

//Message model and services
const MessageModel = require('../models/message_model');
const MessageService = require('../models/message_services');
const messageService = MessageService(MessageModel);

//Hardware route
router.get('/', async (req, res) => {
  const message = await messageService.getLatestMessage();
  if(!message){
    res.status(404).send("Could not find message!");
  } else{
    res.status(200).send(message.message);
  }
});

module.exports = router;