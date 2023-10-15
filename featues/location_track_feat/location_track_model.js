const mongoose = require('mongoose');


const journeyDataSchema = new mongoose.Schema({
    battery_chargePercentage: String,
    lat: String,
    long: String,
    accuracy: String,
    altitude: String,
    speed: String,
    created_at: {
        type: Date,
        default: Date.now()
    },
});

const sessionSchema = new mongoose.Schema({
    journey_id: String,
    journey_data: [journeyDataSchema],
});

const individualSchema = new mongoose.Schema({
    user_unique_id: String,
    sessions: [sessionSchema],
});

const individualModel = mongoose.model('Individual', individualSchema);



module.exports = individualModel;

