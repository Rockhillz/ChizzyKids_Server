const Classroom = require("../models/Classroom");
const Student = require("../models/Student");
const Graduate = require("../models/Graduate");
const Subject = require("../models/Subject");

// Map class promotion hierarchy
const classPromotionMap = {
  PRIMARY6: "JSS1",
  JSS1: "JSS2",
  JSS2: "JSS3",
  JSS3: "SSS1",
  SSS1: "SSS2",
  SSS2: "SSS3",
  SSS3: null, // Null means graduation
};


// New Update for Promotion Students and Graduating
exports.promoteStudents = async (req, res) => {
  try {
    const { fromClassName } = req.body; // Get class to promote from request
    
    if (!fromClassName || !classPromotionMap[fromClassName]) {
        return res
          .status(400)
          .json({ message: "Invalid class promotion request" });
      }

      const nextClassName = classPromotionMap[fromClassName];

      const currentClassroom = await Classroom.findOne({
        className: fromClassName,
      });

      if (!currentClassroom) {
        return res
          .status(404)
          .json({ message: `Classroom ${fromClassName} not found` });
      }

      const studentsToPromote = await Student.find({
        classroom: currentClassroom._id,
      });

      if (!studentsToPromote.length) {
        return res
          .status(200)
          .json({ message: `No students in ${fromClassName}` });
      }

      if (nextClassName) {
        // PROMOTE STUDENTS TO NEXT CLASS
        const nextClassroom = await Classroom.findOne({
          className: nextClassName,
        });

        if (!nextClassroom) {
          return res
            .status(404)
            .json({ message: `Classroom ${nextClassName} not found` });
        }

        // Remove students from current subjects
        await Subject.updateMany(
          { _id: { $in: currentClassroom.subjects } },
          { $pull: { students: { $in: studentsToPromote.map((s) => s._id) } } }
        );

        // Update students' classroom
        for (const student of studentsToPromote) {
          student.classroom = nextClassroom._id;
          student.subjects = nextClassroom.subjects;
          await student.save();
        }

        // Add students to new subjects
        await Subject.updateMany(
          { _id: { $in: nextClassroom.subjects } },
          {
            $push: { students: { $each: studentsToPromote.map((s) => s._id) } },
          }
        );

        // Update classrooms
        await Classroom.updateOne(
          { _id: currentClassroom._id },
          { $pull: { students: { $in: studentsToPromote.map((s) => s._id) } } }
        );

        await Classroom.updateOne(
          { _id: nextClassroom._id },
          {
            $push: { students: { $each: studentsToPromote.map((s) => s._id) } },
          }
        );

        return res.status(200).json({
          message: `Promoted students from ${fromClassName} to ${nextClassName}`,
        });
      } else {
        // GRADUATION LOGIC
        const graduates = studentsToPromote.map((student) => ({
          fullname: student.fullname,
          graduationYear: new Date().getFullYear(),
          formerClassroom: fromClassName,
          otherDetails: "Graduated successfully",
        }));

        await Subject.updateMany(
          { _id: { $in: currentClassroom.subjects } },
          { $pull: { students: { $in: studentsToPromote.map((s) => s._id) } } }
        );

        await Graduate.insertMany(graduates);
        await Student.deleteMany({
          _id: { $in: studentsToPromote.map((s) => s._id) },
        });

        return res.status(200).json({
          message: `Graduated ${graduates.length} students from ${fromClassName}`,
        });
      }
    } catch (error) {
      console.error("Error during promotion:", error);
      return res
        .status(500)
        .json({ message: "An error occurred during promotion." });
      }
  };
  
  // exports.promoteStudents = async (req, res) => {
  //     try {
  //       // Loop through all classrooms in the promotion map
  //       for (const currentClassName of Object.keys(classPromotionMap)) {
  //         const nextClassName = classPromotionMap[currentClassName];
  
  //         // Find the current classroom by className
  //         const currentClassroom = await Classroom.findOne({ className: currentClassName });
  
  //         if (!currentClassroom) continue; // Skip if the classroom does not exist
  
  //         // Find all students in the current classroom
  //         const studentsToPromote = await Student.find({ classroom: currentClassroom._id });
  
  //         if (!studentsToPromote.length) continue; // Skip if no students in the class
  
  //         if (nextClassName) {
  //           // PROMOTION LOGIC
  //           const nextClassroom = await Classroom.findOne({ className: nextClassName });
  
  //           if (!nextClassroom) {
  //             console.error(`Classroom ${nextClassName} not found!`);
  //             continue;
  //           }
  
  //           // Step 1: Remove students from current subjects
  //           for (const subjectId of currentClassroom.subjects) {
  //             await Subject.updateOne(
  //               { _id: subjectId },
  //               { $pull: { students: { $in: studentsToPromote.map(s => s._id) } } }
  //             );
  //           }
  
  //           // Step 2: Update students' classroom and subjects
  //           for (const student of studentsToPromote) {
  //             // Update the classroom
  //             student.classroom = nextClassroom._id;
  
  //             // Update the subjects to match the new classroom
  //             student.subjects = nextClassroom.subjects;
  //             await student.save();
  //           }
  
  //           // Step 3: Add promoted students to new subjects
  //           for (const subjectId of nextClassroom.subjects) {
  //             await Subject.updateOne(
  //               { _id: subjectId },
  //               { $push: { students: { $each: studentsToPromote.map(s => s._id) } } }
  //             );
  //           }
  
  //           // Step 4: Update classroom students arrays
  //           await Classroom.updateOne(
  //             { _id: currentClassroom._id },
  //             { $pull: { students: { $in: studentsToPromote.map(s => s._id) } } }
  //           );
  
  //           await Classroom.updateOne(
  //             { _id: nextClassroom._id },
  //             { $push: { students: { $each: studentsToPromote.map(s => s._id) } } }
  //           );
  
  //           console.log(`Promoted students from ${currentClassName} to ${nextClassName}`);
  //         } else {
  //           // GRADUATION LOGIC
  //           const graduates = studentsToPromote.map(student => ({
  //             fullname: student.fullname,
  //             graduationYear: new Date().getFullYear(),
  //             formerClassroom: currentClassName,
  //             otherDetails: "Graduated successfully",
  //           }));
  
  //           // Step 1: Remove students from subjects
  //           for (const subjectId of currentClassroom.subjects) {
  //             await Subject.updateOne(
  //               { _id: subjectId },
  //               { $pull: { students: { $in: studentsToPromote.map(s => s._id) } } }
  //             );
  //           }
  
  //           // Step 2: Move students to the Graduates collection
  //           await Graduate.insertMany(graduates);
  
  //           // Step 3: Remove graduated students from the system
  //           await Student.deleteMany({ _id: { $in: studentsToPromote.map(s => s._id) } });
  
  //           console.log(`Graduated ${graduates.length} students from ${currentClassName}`);
  //         }
  //       }
  
  //       res.status(200).send("Promotion completed successfully!");
  //     } catch (error) {
  //       console.error("Error during promotion:", error);
  //       res.status(500).send("An error occurred during promotion.");
  //     }
  // };