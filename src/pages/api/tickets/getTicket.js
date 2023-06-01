import Ticket from "@/server/models/ticket"
import Event from "@/server/models/event"
import connectMongo from "@/server/mongo";

const handler = async (req, res) => {
    if (req.method === 'GET') {
        try {
            const { eventContractAddress, ticketNumber } = req.query;
            // connect to MongoDB
            await connectMongo();

            const rawTicket = await Ticket.findOne({
                eventContractAdress: eventContractAddress,
                ticketNumber: parseInt(ticketNumber)
            }).populate("eventDataTrait");
            if (!rawTicket) {
                return res.status(404).json({ message: "Ticket not found." });
            }
            const ticket = {
                owner:rawTicket.owner,
                ticketNumber:rawTicket.ticketNumber,
                eventContractAdress:rawTicket.eventContractAdress,
                user:rawTicket.used,
                usedDate:rawTicket.usedDate,
                eventTrait:rawTicket.eventDataTrait
            };
            res.status(200).json({ ticket });
          } catch (err) {
            console.error(err);
            res.status(500).json({ message: "Unable to fetch ticket." });
          }
    } else {
        res.status(405).json({ message: 'Method not allowed.' });
    }
};

export default handler;
