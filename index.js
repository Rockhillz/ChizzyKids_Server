const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config(); 

const dbUrl = process.env.MONGODB_URL;

// Importing Routes 
const studentRoute = require("./routes/studentRoutes");
const attendanceRoute = require('./routes/attendanceRoutes');
const teacherRoute = require("./routes/teacherRoutes");
const announcementRoute = require("./routes/annoucementRoutes");
const subjectRoute = require("./routes/subjectRoutes");
const classroomRoute = require("./routes/classroomRoutes");
const reviewRoute = require("./routes/reviewRoutes");

mongoose.connect(dbUrl).then(() => {
    console.log("Database connected");
    const app = express();
    const port =  8080;

    //Middleware
    app.use(express.json());

    //Mount Routes on /api
    app.use("/api", studentRoute);
    app.use('/api', attendanceRoute);
    app.use("/api", teacherRoute);
    app.use("/api", announcementRoute);
    app.use("/api", subjectRoute);
    app.use("/api", classroomRoute);
    app.use("/api", reviewRoute);


    app.get('/', (req, res) => {
        res.send("Welcome to ChizzyKids server");
    });
    app.listen(port, () => {
        console.log(`😍😍 Server running on port ${port} 🎉🥳`);
    });
}).catch((Error) => {
    console.log(`Failed to connect to MongoDB`, Error);
})