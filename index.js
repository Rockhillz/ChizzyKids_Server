const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const cors = require("cors"); // For Cross-Origin Resource Sharing (CORS)

const dbUrl = process.env.MONGODB_URL;

// Importing Routes
const studentRoute = require("./routes/studentRoutes");
const attendanceRoute = require("./routes/attendanceRoutes");
const teacherRoute = require("./routes/teacherRoutes");
const subjectRoute = require("./routes/subjectRoutes");
const classroomRoute = require("./routes/classroomRoutes");
const reviewRoute = require("./routes/reviewRoutes");
const eventRoute = require("./routes/eventAndNewsRoutes");
const markRoute = require("./routes/markRoutes");
const termRoute = require("./routes/termRoutes");
const sessionRoute = require("./routes/sessionRoutes");
const promotionRoute = require("./routes/promotionAndGradRoutes");
const galleryRoute = require("./routes/galleryRoutes");
const reportRoute = require("./routes/reportRoutes");

mongoose
  .connect(dbUrl)
  .then(() => {
    console.log("Database connected");
    const app = express();
    const port = 8080;

    //Middleware
    app.use(express.json());
    app.use(
      cors({
        origin: [
          "http://localhost:5173",
          "http://localhost:5174",
          "http://localhost:5175",
          "https://chizzy-kids-school.onrender.com",
          "https://chizzykidsgroupofschools.com.ng",
        ],
        methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
        allowedHeaders: ["Content-Type", "Authorization"],
        credentials: true,
      })
    );

    //Mount Routes on /api
    app.use("/api", studentRoute);
    app.use("/api", attendanceRoute);
    app.use("/api", teacherRoute);
    app.use("/api", subjectRoute);
    app.use("/api", classroomRoute);
    app.use("/api", reviewRoute);
    app.use("/api", eventRoute);
    app.use("/api", markRoute);
    app.use("/api", termRoute);
    app.use("/api", sessionRoute);
    app.use("/api", promotionRoute);
    app.use("/api", galleryRoute);
    app.use("/api", reportRoute);

    // app.set("view engine", "ejs");
    // app.set("views", "./views");

    app.get("/", (req, res) => {
      res.send("Welcome to ChizzyKids server");
    });
    app.listen(port, () => {
      console.log(`😍😍 Server running on port ${port} 🎉🥳`);
    });
  })
  .catch((Error) => {
    console.log(`Failed to connect to MongoDB`, Error);
  });
