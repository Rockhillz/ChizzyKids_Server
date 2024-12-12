const mongoose = require("mongoose");
const Student = require("../models/Student"); // Adjust the path as needed
const Teacher = require("../models/Teacher"); // Adjust the path as needed
require('dotenv').config();

const DATABASE_URL = process.env.MONGODB_URL; // Replace with your database URL

// Connect to the database
mongoose.connect(DATABASE_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("Connected to the database"))
.catch((err) => console.error("Database connection failed:", err));

// Migration function
async function migrateSchema() {
  try {
    // Add fields to Student schema
    await Student.updateMany(
      {}, 
      { $set: { resetPasswordToken: null, resetPasswordExpires: null } }
    );
    console.log("Student schema migration completed");

    // Add fields to Teacher schema
    await Teacher.updateMany(
      {}, 
      { $set: { resetPasswordToken: null, resetPasswordExpires: null } }
    );
    console.log("Teacher schema migration completed");

  } catch (error) {
    console.error("Migration failed:", error);
  } finally {
    mongoose.connection.close(); // Close the connection when done
  }
}

// Run the migration
migrateSchema();
