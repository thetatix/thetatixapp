import connectMongo from '@/server/mongo';
import Event from '@/server/models/event';

const handler = async (req, res) => {
  if(req.method === 'GET') {
    try {
      const { searchQuery } = req.query;
      // connect to MongoDB
      await connectMongo();

      const events = await Event.find({
        eventName: { $regex: searchQuery, $options: 'i'}
      }).exec();
      
      
  
      // find all events and return them
      if (events.length === 0) {
        // Handle case where no events were found
        // For example, return an error message
        res.status(404).json({ error: "No events found", events: {length: 0}, data: null, status: "warning", message: "No events found." });
      }

        // Return the events
        res.status(200).json({events, searchQuery});
      
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Unable to fetch events.' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed.' });
  }
};

export default handler;
