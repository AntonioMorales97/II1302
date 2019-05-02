const express = require("express");
const router = express.Router();
const { ensureAuthenticated } = require("../config/auth");

//Message model and service
const MessageModel = require("../models/message_model");
const MessageService = require("../models/message_services");
const messageService = MessageService(MessageModel);

// Dashboard
router.get("/", ensureAuthenticated, async (req, res) => {
    const latestMessage = await messageService.getLatestMessage();
    const messages = await messageService.getMessages();

    if (!latestMessage) {
        res.status(204).render("dashboard", {
            name: req.user.name,
            message: "Could not find message!"
        });
    } else {
        res.status(200).render("dashboard", {
            name: req.user.name,
            latestMessage: latestMessage.message,
            messages: messages
        });
    }
});

router.post("/message", ensureAuthenticated, async (req, res) => {
    const latestMessage = await messageService.enterMessage(req.body.message);
    const messages = await messageService.getMessages();
    if (latestMessage) {
        res.render("dashboard", {
            name: req.user.name,
            latestMessage: latestMessage.message,
            messages: messages
        });
    } else {
        console.log(
            "Something went wrong when posting message. Message is: " + message
        ); //should not come here
    }
});

/* Update Message date */
router.post("/message/update", ensureAuthenticated, async (req, res) => {
    const latestMessage = await messageService.updateMessage(req.body.msgToUpdate);
    const messages = await messageService.getMessages();
    if (latestMessage) {
        res.render("dashboard", {
            name: req.user.name,
            latestMessage: latestMessage.message,
            messages: messages
        });
    } else {
        console.log(
            "Something went wrong when attempting to update the message. Message is: " + latestMessage
        );
    }
});

module.exports = router;
