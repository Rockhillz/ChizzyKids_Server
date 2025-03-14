const Session = require("../models/Session");
const Term = require("../models/Term");
const { archiveTermData } = require("../utilities/archive");

// Create Term.....working
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

    // Ensure termName is valid
    const validTerms = ["First Term", "Second Term", "Third Term"];
    if (!validTerms.includes(termName)) {
      return res.status(400).json({ error: "Invalid term name" });
    }

    // Check if the term already exists for the session
    const existingTerm = await Term.findOne({ termName, session: sessionId });
    if (existingTerm) {
      return res.status(400).json({ error: `The ${termName} already exists for this session` });
    }

    // Fetch the current active term across all sessions
    const currentTerm = await Term.findOne({ isCurrentTerm: true });

    // If a current term exists, archive its data
    if (currentTerm) {
      await archiveTermData(currentTerm._id);

      // Mark the current term as archived
      currentTerm.isArchived = true;
      currentTerm.isCurrentTerm = false;
      await currentTerm.save();
    }

    // Explicitly unset `isCurrentTerm` for all terms in the database
    const updateResult = await Term.updateMany({}, { $set: { isCurrentTerm: false } });


    // Create the new term and set it as current
    const newTerm = new Term({
      termName,
      session: sessionId,
      startDate,
      endDate,
      isCurrentTerm: true,
    });
    await newTerm.save();

    res.status(201).json({
      message: "Term created successfully and set as current",
      term: newTerm,
    });
  } catch (error) {
    console.error("Unexpected error: ", error);
    res.status(500).json({ message: "An unexpected error occurred" });
  }
};



// Get all terms for a session
exports.getAllTermsForSession = async (req, res) => {
  const { sessionId } = req.params;

  try {
    const terms = await Term.find({ session: sessionId }).populate(
      "session",
      "sessionName"
    );

    res.status(200).json({ message: "Terms retrieved successfully", terms });
  } catch (error) {
    console.error("Unexpected error: ", error);
    res.status(500).json({ message: "An unexpected error occurred" });
  }
};

// get current term for a session
exports.getCurrentTermAndSession = async (req, res) => {
  try {
    // Fetch current session
    const currentSession = await Session.findOne({ isCurrentSession: true });
    if (!currentSession) {
      return res.status(404).json({ error: "No current session found" });
    }

    // Fetch current term and populate session details
    const currentTerm = await Term.findOne({ isCurrentTerm: true }).populate(
      "session",
      "sessionName"
    );

    if (!currentTerm) {
      return res.status(404).json({ error: "No current term found" });
    }

    // Return both current session and term
    res.status(200).json({
      session: currentSession,
      term: currentTerm,
    });
  } catch (error) {
    console.error("Unexpected error:", error);
    res.status(500).json({ message: "An unexpected error occurred" });
  }
};