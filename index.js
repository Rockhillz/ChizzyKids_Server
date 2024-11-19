const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config(); 

const dbUrl = process.env.MONGODB_URL;

//Routes 
const studentRoute = require("./routes/studentRoutes");
const teacherRoute = require("./routes/teacherRoutes"); 


mongoose.connect(dbUrl).then(() => {
    console.log("Database connected");
    const app = express();
    const port =  8080;

    //Middleware
    app.use(express.json());

    //Mount Routes on /api
    app.use("/api", studentRoute);
    app.use("/api", teacherRoute);



    app.get('/', (req, res) => {
        res.send("Welcome to ChizzyKids server");
    });
    app.listen(port, () => {
        console.log(`😍😍 Server running on port ${port} 🎉🥳`);
    });
}).catch((Error) => {
    console.log(`Failed to connect to MongoDB`, Error);
})