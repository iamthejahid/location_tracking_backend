const express = require('express');
const { connectDB } = require('./config/database');
const { clientError, serverError } = require('./controller/error');
require('dotenv').config();
const { Settings } = require('luxon');


const app = express();
const log = console.log;
const port = process.env.PORT || 3000;
Settings.defaultZoneName = 'Asia/Dhaka';




app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use((req, res, next) => {
    const timestamp = new Date().toLocaleString();
    const method = req.method;
    const url = req.originalUrl;
    const ip = req.ip;

    // Log the request details
    log(`[${timestamp}] ${ip} - ${method} ${url}`);

    // Continue processing the request
    next();
});




// Routes
const locationTrackRoutes
    = require('./featues/location_track_feat/location_track_routes');


// Route uses
app.use('/api', locationTrackRoutes);
app.get('/', (req, res) => {
    res.status(200).send("Location Track Backend!");
});

app.use(clientError);
app.use(serverError);

app.listen(port, async () => {
    log(`server is running at http://localhost:${port}`);
    await connectDB();
});