const IndividualModel = require('./location_track_model');

exports.logJourney = async (req, res) => {
    try {


        const user_unique_id = req.body.user_unique_id;
        const journeyId = req.body.journeyId;
        const { journeyData } = req.body;
        let individual = await IndividualModel.findOne({ user_unique_id });

        if (individual === null) {
            // Create a new individual with the given user_unique_id 
            individual = new IndividualModel({ user_unique_id, sessions: [] });
        }

        let journey = await individual.sessions.find((s) => s.journey_id = journeyId);
        if (!journey) {
            individual.sessions.push({
                journey_id: journeyId,
                journey_data: [],
            });
            journey = await individual.sessions.find((s) => s.journey_id = journeyId);

        }
        journey.journey_data.push(journeyData);

        await individual.save();

        return res.status(201).json({
            message: 'Journey data saved',
        });
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ message: error.message });
    }
};



exports.getSpecificJourneyDetails = async (req, res) => {
    try {
        const user_unique_id = req.body.user_unique_id;
        const journeyId = req.body.journeyId;
        let individual = await IndividualModel.findOne({ user_unique_id });



        if (individual === null) {
            return res.status(404).json({
                message: 'No user Found',
            });
        }

        let session = await individual.sessions.find((s) => s.journey_id === journeyId);

        if (session === undefined) {
            return res.status(404).json({
                message: 'No journey Found',
            });
        } else {
            const journeyData = session.journey_data;
            let initial_battery = journeyData[0].battery_chargePercentage;
            let final_battery = journeyData[journeyData.length - 1].battery_chargePercentage;
            let timeElapsed = (journeyData[journeyData.length - 1].created_at - journeyData[0].created_at) / 1000;

            const latLongData = journeyData.map((data) => ({
                lat: data.lat,
                long: data.long,
            }));
            return res.status(200).json({
                "time_elapsed_in_sec": timeElapsed,
                "initial_battery": initial_battery,
                "final_battery": final_battery,
                "locations": latLongData,
            });

        }

    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ message: error.message });
    }
};
