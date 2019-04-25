//This is where the hardware will connect
const express = require('express');
const router = express.Router();

//Message model
const Message = require('../models/Message');

//
router.get('/', (req, res) => {
  Message.findOne().sort({date: -1})
  .then(message => {
    if(!message){
      res.status(404).send({ message: "Could not find message!"});
    } else{
      res.status(200).send({ message: message.message});
    }
  })
  .catch(err => {
    console.log(err);
  });
});

module.exports = router;