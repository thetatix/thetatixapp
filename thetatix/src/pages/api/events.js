import connectMongo from '@/server/mongo';
import Event from '@/server/models/event';

const handler = async (req, res) => {
  try {
    // connect to MongoDB
    await connectMongo();

    // find all events and return them
    const events = await Event.find().exec();
    if (events.length === 0) {
      // Handle case where no events were found
      // For example, return an error message
      res.status(404).json({ message: "No events found." });
    } else {
      // Return the events
      res.status(200).json(events);
    }
    // res.status(200).json(events);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Unable to fetch events." });
  }
};

export default handler;
