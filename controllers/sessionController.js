// const AcademicYear = require('../models/AcademicYear');

// exports.createAcademicYear = async (req, res) => {
//   try {
//     const { year, terms, isActive } = req.body;

//     // Validate year format
//     if (!/^\d{4}\/\d{4}$/.test(year)) {
//       return res.status(400).json({ message: 'Invalid year format. Expected format: YYYY/YYYY' });
//     }

//     // Check for existing academic year
//     const existingYear = await AcademicYear.findOne({ year });
//     if (existingYear) {
//       return res.status(400).json({ message: 'Academic year already exists' });
//     }

//     // Ensure only one term is active, if `isActive` is true
//     const activeTermsCount = terms.filter(term => term.isActive).length;
//     if (activeTermsCount > 1) {
//       return res.status(400).json({ message: 'Only one term can be active at a time' });
//     }

//     // Create a new academic year
//     const academicYear = new AcademicYear({
//       year,
//       terms,
//       isActive: !!isActive, // Ensure it's a boolean
//     });

//     await academicYear.save();

//     res.status(201).json({
//       message: 'Academic year created successfully',
//       academicYear,
//     });
//   } catch (error) {
//     console.error('Error creating academic year:', error);
//     res.status(500).json({ message: 'An unexpected error occurred', error });
//   }
// };

// exports.setActiveTerm = async (req, res) => {
//     try {
//       const { year, termName } = req.body;

//       // Find the academic year
//       const academicYear = await AcademicYear.findOne({ year });
//       if (!academicYear) {
//         return res.status(404).json({ message: 'Academic year not found' });
//       }

//       // Deactivate all terms
//       academicYear.terms.forEach(term => {
//         term.isActive = term.name === termName; // Activate only the matching term
//       });

//       await academicYear.save();

//       res.status(200).json({ message: 'Active term updated successfully', academicYear });
//     } catch (error) {
//       console.error(error);
//       res.status(500).json({ message: 'An unexpected error occurred', error });
//     }
//   };

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
    res.status(500).json({ message: "An unexpected error occurred" });
  }
};