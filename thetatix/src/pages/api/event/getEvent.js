import connectMongo from '@/server/mongo';
import Event from '@/server/models/event';

const handler = async (req, res) => {
  if (req.method === 'GET') {
    try {
      const { eventContractAddress } = req.query;
      await connectMongo();
      const event = await Event.findOne({ contractAddress: eventContractAddress });

      if (!event) {
        res.status(404).json({ message: 'Event not found.' });
      } else {
        res.status(200).json({ event });
      }
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Unable to fetch event.' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed.' });
  }
};

export default handler;
