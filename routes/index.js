const express = require("express");
const router = express.Router();

//Message model and service
const MessageModel = require("../models/message_model");
const MessageService = require("../models/message_services");
const messageService = MessageService(MessageModel);

// Welcome Page
router.get("/", async (req, res) => {
    const latestMessage = await messageService.getLatestMessage();
    if (!latestMessage) {
        res.status(200).render("welcome", {
            latestMessage: "Could not find any message!"
        });
    } else {
        res.status(200).render("welcome", {
            latestMessage: latestMessage.message
        });
    }
});

module.exports = router;
