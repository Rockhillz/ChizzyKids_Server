const Classroom = require("../models/Classroom");
const Teacher = require("../models/Teacher");
const Subject = require("../models/Subject");

// Create classrooms........Working
exports.createClassroom = async (req, res) => {
  const { className } = req.body;

  try {
    //Check if classroom exist
    const existingClassroom = await Classroom.findOne({ className });
    if (existingClassroom) {
      return res.status(400).json({ message: "Classroom already exists" });
    }

    // Create a new classroom
    const newClassroom = new Classroom({ className });
    await newClassroom.save();
    res
      .status(200)
      .json({ message: "Classroom successfully created", newClassroom });
  } catch (error) {
    console.log("Unexpected error: ", error);
  }
};

// Get all classrooms....... Working
exports.getAllClassrooms = async (req, res) => {
  try {
    const classrooms = await Classroom.find()
      .populate("teacher", "fullname") // Populate teacher field with the fullname field
      .populate("students", "_id") // Optionally, you can just get student IDs if you don't need more data
      .populate("subjects", "_id"); // Optionally, you can just get subject IDs if you don't need more data

    // Transform classrooms to include counts for students and subjects
    const transformedClassrooms = classrooms.map((classroom) => ({
      _id: classroom._id,
      className: classroom.className,
      teacher: classroom.teacher, // This will already contain the teacher's populated details
      studentsCount: classroom.students.length,
      subjectsCount: classroom.subjects.length,
    }));

    res.status(200).json({ classrooms: transformedClassrooms });
  } catch (error) {
    console.error("Unexpected error: ", error);
    res.status(500).json({ message: "Failed to fetch classrooms" });
  }
};

// Assign a Teacher to the classroom...... working
exports.assignTeacher = async (req, res) => {
  const { teacherId, classroomId } = req.body;

  try {
    // Check if teacher exists
    const teacher = await Teacher.findById(teacherId);
    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }

    // Check if classroom exists
    const classroom = await Classroom.findById(classroomId);
    if (!classroom) {
      return res.status(404).json({ message: "Classroom not found" });
    }

    // Validate if the classroom already has a teacher assigned
    if (classroom.teacher) {
      return res
        .status(400)
        .json({ message: "This classroom already has a teacher assigned" });
    }

    // Assign the teacher to the classroom
    classroom.teacher = teacherId;
    await classroom.save();

    // Optionally update the teacher record without triggering full validation
    await Teacher.updateOne(
      { _id: teacherId },
      { $set: { classroom: classroomId } }, // Only update classroom field
      { runValidators: false } // Skip full validation
    );

    // Respond with success
    res
      .status(200)
      .json({ message: "Teacher assigned successfully", classroom });
  } catch (error) {
    console.error("Unexpected error: ", error);
    res
      .status(500)
      .json({ message: "An unexpected error occurred", error: error.message });
  }
};

//Assign subjects to a class......Working
exports.assignSubjectsToClass = async (req, res) => {
  const { classId, subjectIds } = req.body; // Accept multiple subject IDs

  if (!Array.isArray(subjectIds) || subjectIds.length === 0) {
    return res.status(400).json({ message: "Please provide a valid array of subject IDs." });
  }

  try {
    // Check if class exists
    const classObj = await Classroom.findById(classId);
    if (!classObj) {
      return res.status(404).json({ message: "Class not found" });
    }

    // Find all subject objects based on IDs
    const validSubjects = await Subject.find({ _id: { $in: subjectIds } });

    if (validSubjects.length !== subjectIds.length) {
      return res.status(404).json({ message: "Some subjects not found." });
    }

    const invalidSubjects = subjectIds.filter(
      (id) => !validSubjects.map((s) => s._id.toString()).includes(id.toString())
    );
    
    if (invalidSubjects.length > 0) {
      return res.status(404).json({
        message: "Some subjects not found.",
        invalidSubjects,
      });
    }
    

    // Filter out already assigned subjects
    const newSubjectIds = subjectIds.filter(
      (subjectId) => !classObj.subjects.includes(subjectId.toString())
    );
    

    if (newSubjectIds.length === 0) {
      return res
        .status(400)
        .json({ message: "All provided subjects are already assigned to this class." });
    }

    // Assign new subjects to the class
    classObj.subjects.push(...newSubjectIds);
    await classObj.save();

    res.status(200).json({
      message: "Subjects assigned to class successfully.",
      class: classObj,
      updatedSubjects: classObj.subjects,
      newlyAssignedSubjects: newSubjectIds,
    });
  } catch (error) {
    console.error("Error assigning subjects to class:", error);
    return res.status(500).json({ error: error.message });
  }
};

// Remove assigned subjects.....Working
exports.removeSubjectsFromClass = async (req, res) => {
  const { classId, subjectIds } = req.body; // Accept multiple subject IDs

  if (!Array.isArray(subjectIds) || subjectIds.length === 0) {
    return res.status(400).json({ message: "Please provide a valid array of subject IDs." });
  }

  try {
    // Check if class exists
    const classObj = await Classroom.findById(classId);
    if (!classObj) {
      return res.status(404).json({ message: "Class not found" });
    }

    // Find all subject objects based on IDs
    const validSubjects = await Subject.find({ _id: { $in: subjectIds } });

    if (validSubjects.length !== subjectIds.length) {
      return res.status(404).json({ message: "Some subjects not found." });
    }

    const invalidSubjects = subjectIds.filter(
      (id) => !validSubjects.map((s) => s._id.toString()).includes(id.toString())
    );

    if (invalidSubjects.length > 0) {
      return res.status(404).json({
        message: "Some subjects not found.",
        invalidSubjects,
      });
    }

    // Filter out subjects not currently assigned
    const removableSubjectIds = subjectIds.filter(
      (subjectId) => classObj.subjects.includes(subjectId.toString())
    );

    if (removableSubjectIds.length === 0) {
      return res.status(400).json({
        message: "None of the provided subjects are assigned to this class.",
      });
    }

    // Remove subjects from the class
    classObj.subjects = classObj.subjects.filter(
      (subjectId) => !removableSubjectIds.includes(subjectId.toString())
    );
    await classObj.save();

    res.status(200).json({
      message: "Subjects removed from class successfully.",
      class: classObj,
      updatedSubjects: classObj.subjects,
      removedSubjects: removableSubjectIds,
    });
  } catch (error) {
    console.error("Error removing subjects from class:", error);
    return res.status(500).json({ error: error.message });
  }
};


// Get subject by class.......Working
exports.getSubjectsOfClass = async (req, res) => {
  const { ClassroomId } = req.params;

  try {
    // Check if the class exists
    const classObj = await Classroom.findById(ClassroomId).populate("subjects", "name");

    if (!classObj) {
      return res.status(404).json({ message: "Class not found" });
    }

    // Return the subjects assigned to the class
    res.status(200).json({
      message: "Subjects fetched successfully.",
      class: {
        id: classObj._id,
        name: classObj.name,
        teacher: classObj.teacher,
      },
      subjects: classObj.subjects,
    });
  } catch (error) {
    console.error("Error fetching subjects for class:", error);
    return res.status(500).json({ error: error.message });
  }
};


// Remove assigned teacher....Working
exports.removeTeacherFromClassroom = async (req, res) => {
  const { classroomId } = req.body;

  try {
    // Check if the classroom exists
    const classroom = await Classroom.findById(classroomId);
    if (!classroom) {
      return res.status(404).json({ message: "Classroom not found" });
    }

    // Check if a teacher is assigned to the classroom
    if (!classroom.teacher) {
      return res
        .status(400)
        .json({ message: "No teacher is assigned to this classroom" });
    }

    const teacherId = classroom.teacher; 

    // Remove the teacher assignment from the classroom
    classroom.teacher = null;
    await classroom.save();

    // Update the Teacher schema by removing the classroom assignment
    await Teacher.updateOne(
      { _id: teacherId },
      { $unset: { classroom: "" } }, 
      { runValidators: false }
    );

    res.status(200).json({
      message: "Teacher removed from classroom successfully",
      classroom,
    });
  } catch (error) {
    console.error("Unexpected error: ", error);
    res
      .status(500)
      .json({ message: "An unexpected error occurred", error: error.message });
  }
};


// Get single classroom........Working
exports.getClassroomById = async (req, res) => {
  const { classroomId } = req.params;

  try {
    const classroom = await Classroom.findById(classroomId)
      .populate("teacher", "fullname")
      .populate("students", "fullname")
      .populate("subjects", "name");

    if (!classroom) {
      return res.status(404).json({ message: "Classroom not found" });
    }

    res.status(200).json({ classroom });
  } catch (error) {
    console.error("Unexpected error: ", error);
    res.status(500).json({ message: "Failed to fetch classroom" });
  }
};

// Get classroom assigned to a teacher.... working
exports.getClassroomAssignedToTeacher = async (req, res) => {
  try {
    // Get the teacher's ID from the decoded token (available in req.teacher)
    const teacherId = req.teacher._id;

    // Find classroom assigned to the teacher
    const classroom = await Classroom.findOne({ teacher: teacherId })
      .populate("teacher", "fullname") // Get teacher name
      .populate("students", "fullname"); // Get student names

    if (!classroom) {
      return res
        .status(404)
        .json({ success: false, message: "Classroom not assigned yet" });
    }

    res.json({
      success: true,
      data: {
        id: classroom._id,
        classroom: classroom.className,
        teacher: classroom.teacher.fullname,
        studentCount: classroom.students.length,
        students: classroom.students.map((student) => ({
          id: student._id,
          name: student.fullname,
        })),
      },
    });
  } catch (error) {
    console.error("Error fetching classroom details:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// delete a classroom..... Working
exports.deleteClassroom = async (req, res) => {
  const { ClassroomId } = req.params;

  try {
    // Find classroom by ID and remove it
    const deletedClassroom = await Classroom.findByIdAndDelete(ClassroomId);

    if (!deletedClassroom) {
      return res.status(404).json({ message: "Classroom not found" });
    }

    res.json({ message: "Classroom deleted successfully" });
  } catch (error) {
    console.error("Error deleting classroom:", error);
    res.status(500).json({ message: "Server error" });
  }
};


