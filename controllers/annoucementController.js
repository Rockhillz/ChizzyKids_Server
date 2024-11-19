const Message = require('../models/Annoucement');

//Create Announcement
exports.createMessage = async (req, res) => {
    const { title, body } = req.body

    try {
        const newMessage = new Message({ title, body});
        await newMessage.save()
        res.status(200).json({ message: "Annoucement created successful", newMessage})
    } catch (error) {
        console.log(error)
    }
}


// get all anouncement
exports.getMessages = async (req, res) => {
    try {
        const messages = await Message.find();
        res.status(200).json({ messages });
    } catch (error) {
        console.log(error);
    }
}