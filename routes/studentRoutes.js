const express = require('express');
const router = express.Router()

const { createStudent, loginStudent, assignClassToStudent, getAllStudent } = require("../controllers/studentController");
const { createClassroom, getAllClassrooms } = require("../controllers/classroomController");

// Creating Endpoints for students.
router.post("/student/register", createStudent);
router.post("/student/login", loginStudent);
router.patch("/assign-Class", assignClassToStudent)
router.get("/students", getAllStudent)



//Creating Endpoints for classrooms
router.post('/create-classroom', createClassroom);
router.get('/classrooms', getAllClassrooms);

module.exports = router;