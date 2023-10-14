const IndividualModel = require('./location_track_model');

exports.logJourney = async (req, res) => {
    try {


        const user_unique_id = req.body.user_unique_id;
        const journeyId = req.body.journeyId;
        const { journeyData } = req.body;
        // // Find the individual with the given user_unique_id 
        let individual = await IndividualModel.findOne({ user_unique_id });

        if (individual === null) {
            // Create a new individual with the given user_unique_id 
            individual = new IndividualModel({ user_unique_id, sessions: [] });
        }


        let session = await individual.sessions.find((s) => s.journey_id === journeyId);


        if (session === undefined) {
            // If session is not found, create a new session
            session = { journey_id: journeyId, journey_data: [] };
            individual.sessions.push(session);
        }

        // // Add the journey data to the session
        session.journey_data.push(journeyData);

        // Save the updated individual document
        await individual.save();

        return res.status(201).json({
            message: 'Journey data saved',
        });
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ message: error.message });
    }
};
