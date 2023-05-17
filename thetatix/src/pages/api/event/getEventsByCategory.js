import connectMongo from '@/server/mongo';
import Event from '@/server/models/event';

const handler = async (req, res) => {
    if (req.method === 'GET') {
        try {
            const categoryId = req.query.categoryId;

            // Connect to MongoDB
            await connectMongo();

            // Find events by category
            const events = await Event.find({ category: categoryId });

            res.status(200).json({ events });
          } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Error retrieving events.' });
          }
    } else {
        res.status(405).json({ message: 'Method not allowed.' });
    }
};

export default handler;
