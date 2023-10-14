const express = require('express');
const router = express.Router();
const locationTrackController = require('./location_track_controller');


router.post('/locationtrack', locationTrackController.logJourney);


module.exports = router;
