import connectMongo from '@/server/mongo';
import Event from '@/server/models/event';

const handler = async (req, res) => {
    if (req.method === 'GET') {
        try {
            const creator = req.query.creator;
            // if (creator === undefined) {
            //     res.status(299).json({error: "Wallet not connected.", data: null, status: "warning", message: "Wallet not connected."});
            // }

            // Connect to MongoDB
            await connectMongo();

            // Find events by creator
            const events = await Event.find({ creator: creator });
            if (events.length === 0) {
              // Handle case where no events were found
              // For example, return an error message
              res.status(404).json({ error: "No events by this creator", events: {length: 0}, data: null, status: "warning", message: "No events found." });
            } else {
              // Return the events
              res.status(200).json({events});
            }
          } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Error retrieving events.', events: {} });
          }
    } else {
        res.status(405).json({ message: 'Method not allowed.' });
    }
};

export default handler;
