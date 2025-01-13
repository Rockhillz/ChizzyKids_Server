const Session = require("../models/Session");
const Term = require("../models/Term");

// Create Term
exports.createTerm = async (req, res) => {
    try {
      const { termName, sessionId, startDate, endDate } = req.body;
  
      // Validation
      if (!termName || !sessionId || !startDate || !endDate) {
        return res.status(400).json({ error: "All fields are required" });
      }
  
      // Check if the session exists
      const session = await Session.findById(sessionId);
      if (!session) {
        return res.status(404).json({ error: "Session not found" });
      }
  
      // Ensure termName is valid (First Term, Second Term, Third Term)
      const validTerms = ['First Term', 'Second Term', 'Third Term'];
      if (!validTerms.includes(termName)) {
        return res.status(400).json({ error: "Invalid term name" });
      }
  
      // Check if the term already exists for the session
      const existingTerm = await Term.findOne({ termName, session: sessionId });
      if (existingTerm) {
        return res.status(400).json({ error: `The ${termName} already exists for this session` });
      }
  
      // Unset any current term for the session
      await Term.updateMany({ session: sessionId }, { isCurrentTerm: false });
  
      // Create the new term and set it as current
      const newTerm = new Term({ termName, session: sessionId, startDate, endDate, isCurrentTerm: true });
      await newTerm.save();
  
      res.status(201).json({ message: "Term created successfully and set as current", term: newTerm });
  
    } catch (error) {
      console.error("Unexpected error: ", error);
      res.status(500).json({ message: "An unexpected error occurred" });
    }
};


// Get all terms for a session

exports.getAllTermsForSession = async (req, res) => {
  const { sessionId } = req.params;

  try {
    const terms = await Term.find({ session: sessionId }).populate('session', 'sessionName');

    res.status(200).json({ message: "Terms retrieved successfully", terms });
  } catch (error) {
    console.error("Unexpected error: ", error);
    res.status(500).json({ message: "An unexpected error occurred" });
  }
};

// get current term for a session
exports.getCurrentTerm = async (req, res) => {
    try {
      const currentTerm = await Term.findOne({ isCurrentTerm: true }).populate('session', 'sessionName');
      if (!currentTerm) {
        return res.status(404).json({ error: "No current term found" });
      }
  
      res.status(200).json(currentTerm);
    } catch (error) {
      console.error("Unexpected error: ", error);
      res.status(500).json({ message: "An unexpected error occurred" });
    }
  };
  