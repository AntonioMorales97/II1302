

const getLatestMessage = Message => async () => {
   const message = await Message.findOne().sort({ date: -1 });
   return message;
    
};

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
        enterMessage: enterMessage(Message)
    };
}