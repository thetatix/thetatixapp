import connectMongo from '@/server/mongo';
import Event from '@/server/models/event';

const handler = async (req, res) => {
    if (req.method === 'POST') {
        try {
            await connectMongo();

            const { data } = req.body;
            console.log(data);
            const event = new Event({
                contractAddress: "exampleContractAddress1",
                creator: "exampleCreator1",
                ticketsAmount: data.ticketsAmount,
                ticketsPrice: data.ticketsPrice,
                eventName: data.eventName,
                eventDescription: data.eventDescription,
                startDate: data.startDate,
                endDate: data.endDate,
                location: data.location
            });
            
            await event.save();
            res.status(201).json({ message:'Event created successfully.' })
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Unable to create event.' });
        }
    } else {
        res.status(405).json({ message: 'Method not allowed.' });
    }
}

export default handler;