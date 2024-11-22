const Message = require("../models/Annoucement");
const nodemailer = require("nodemailer");

//Create Announcement
exports.createMessage = async (req, res) => {
  const { title, body, sender } = req.body;

  try {
    // Create the message content
    const messageContent = `
            ${title},
            ${body},
            
            Sender: ${sender}
            `;

    // Set up Nodemailer transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "izuchi.alaneme@gmail.com",
        pass: 'fjzp fspn cprx wwqu', 
      },
    });

    // Email options
    const mailOptions = {
      from: "izuchi.alaneme@gmail.com",
      to: "izuchukwualaneme@gmail.com",
      subject: title,
      text: messageContent,
    };

    // Send the email
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent: " + info.response);

    // Save the announcement to the database
    const newAnnouncement = new Message({ title, body, sender });
    await newAnnouncement.save();

    // Respond to the client
    res.status(200).json({
      message: "Announcement created and sent successfully!", newAnnouncement});
  } catch (error) {
    console.log(error);
  }
};

// get all anouncement
exports.getMessages = async (req, res) => {
  try {
    const messages = await Message.find();
    res.status(200).json({ messages });
  } catch (error) {
    console.log(error);
  }
};
