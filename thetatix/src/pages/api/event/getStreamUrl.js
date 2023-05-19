import connectMongo from '@/server/mongo';
import Event from '@/server/models/event';

const handler = async (req, res) => {
    if (req.method === 'GET') {
        try {
            const { eventContractAddress } = req.query;
            await connectMongo();
            //get event
            const event = await Event.findOne({ contractAddress: eventContractAddress });
            //check event exists
            if (!event) {
                res.status(404).json({ message: 'Event not found.', data: null,error: true });
            } else {
                //check event is online event
                console.log(event)
                //check event started

                //return event address
                res.status(200).json({ message:'', data: event , error: false});
            }
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Unable to fetch event.' });
        }
    } else {
        res.status(405).json({ message: 'Method not allowed.', data: null });
    }
};

export default handler;
