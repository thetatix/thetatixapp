// export default async function handler(req, res) {
//     //-----------COMPLETAR-----------
//     res.status(200).json({data:'succes'})
// }

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
      res.status(404).json({ error: "No events in database", events: {}, data: null, status: "warning", message: "No events found." });
    } else {
      // Return the events
      res.status(200).json({events});
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err, events: {}, status: "danger", message: "Unable to fetch events." });
  }
};

export default handler;
