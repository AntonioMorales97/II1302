const getMessages = Message => async () => {
    const messages = await Message.find().sort({ date: -1 }).limit(10);
    return messages;
}

const getLatestMessage = Message => async () => {
   const latestMessage = await Message.findOne().sort({ date: -1 });
   return latestMessage;
    
};

const updateMessage = Message => async (id) => {
    const latestMessage = await Message.findOneAndUpdate({ _id: id }, { date: Date.now() });
    return latestMessage;
}

const enterMessage = Message => async(message) => {
    const foundMessage = await Message.findOneAndUpdate({ message: message}, { $set: { date: Date.now() }}, { new: true });
    if(foundMessage){
        return foundMessage;
    } else{
        const newMessage = new Message({
            message: message,
            date: Date.now()
        });

        const newSavedMessage = await newMessage.save(); 
        return newSavedMessage;
    }
}

module.exports = Message => {
    return {
        getLatestMessage: getLatestMessage(Message),
        enterMessage: enterMessage(Message),
        getMessages: getMessages(Message),
        updateMessage: updateMessage(Message)
    };
}