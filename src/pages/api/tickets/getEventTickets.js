import Ticket from "@/server/models/ticket"
import connectMongo from "@/server/mongo";

const handler = async (req, res) => {
    if (req.method === 'GET') {
        try {
            const { eventContractAddress } = req.query;
            // connect to MongoDB
            await connectMongo();
            // find all tickets of event and return them
            const eventTickets = await Ticket.find({ eventContractAdress: eventContractAddress });
            const ticketsList = [];
            for(let ticket of eventTickets){
                ticketsList.push({
                    owner: ticket.owner,
                    ticketNumber: ticket.ticketNumber,
                    eventContractAdress: ticket.eventContractAdress,
                    user: ticket.used,
                    usedDate: ticket.usedDate,
                })
            }
            // const categories = await Category.find().exec();
            if (ticketsList.length === 0) {
                res.status(404).json({ message: "No rickets found." });
            } else {
                res.status(200).json({ tickets: ticketsList })
            }
          } catch (err) {
            console.error(err);
            res.status(500).json({ message: "Unable to fetch tickets." });
          }
    } else {
        res.status(405).json({ message: 'Method not allowed.' });
    }
};

export default handler;
