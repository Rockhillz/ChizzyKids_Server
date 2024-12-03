const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const cors = require('cors');  // For Cross-Origin Resource Sharing (CORS)

const dbUrl = process.env.MONGODB_URL;

// Importing Routes
const studentRoute = require("./routes/studentRoutes");
const attendanceRoute = require('./routes/attendanceRoutes');
const teacherRoute = require("./routes/teacherRoutes");
const announcementRoute = require("./routes/annoucementRoutes");
const subjectRoute = require("./routes/subjectRoutes");
const classroomRoute = require("./routes/classroomRoutes");
const reviewRoute = require("./routes/reviewRoutes");
const eventRoute = require("./routes/eventRoutes");
const academicRoute = require("./routes/academicYearRoutes");
const gradeRoute = require("./routes/gradeRoutes");

mongoose.connect(dbUrl).then(() => {
    console.log("Database connected");
    const app = express();
    const port =  8080;

    //Middleware
    app.use(express.json());
    app.use(cors({
        origin: ['http://localhost:5173', 'http://localhost:5174',
             'http://localhost:5175', 'http://localhost:5176',
              'http://localhost:5177', 'http://localhost:5178'],  // Allow both local ports
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        allowedHeaders: ['Content-Type', 'Authorization'],
        credentials: true // Add this if you're dealing with cookies or sessions
    }));

    //Mount Routes on /api
    app.use("/api", studentRoute);
    app.use('/api', attendanceRoute);
    app.use("/api", teacherRoute);
    app.use("/api", announcementRoute);
    app.use("/api", subjectRoute);
    app.use("/api", classroomRoute);
    app.use("/api", reviewRoute);
    app.use("/api", eventRoute);
    app.use("/api", academicRoute);
    app.use("/api", gradeRoute);


    app.get('/', (req, res) => {
        res.send("Welcome to ChizzyKids server");
    });
    app.listen(port, () => {
        console.log(`😍😍 Server running on port ${port} 🎉🥳`);
    });
}).catch((Error) => {
    console.log(`Failed to connect to MongoDB`, Error);
})