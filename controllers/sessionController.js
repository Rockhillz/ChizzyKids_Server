const Session = require("../models/Session");

exports.createSession = async (req, res) => {
  try {
    const { sessionName } = req.body;

    // Validation
    if (!sessionName) {
      return res.status(400).json({ error: "Session name is required" });
    }

    // Check if session exist
    const existingSession = await Session.findOne({ sessionName });
    if (existingSession) {
      return res.status(400).json({ message: "Session already exists" });
    }

    // Unset any existing current session
    await Session.updateMany({}, { isCurrentSession: false });

    // Create a new session and set it as current
    const newSession = new Session({ sessionName, isCurrentSession: true });
    await newSession.save();

    res.status(201).json({ message: "Session created successfully and set as current", session: newSession });

  } catch (error) {
    console.error("Unexpected error: ", error);
    return res.status(400).json({ error: "Session already exists" });
  }
};