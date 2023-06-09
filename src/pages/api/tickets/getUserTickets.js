import Ticket from "@/server/models/ticket"
import Event from "@/server/models/event";
import connectMongo from "@/server/mongo";

const handler = async (req, res) => {
    if (req.method === 'GET') {
        try {
            const { owner } = req.query;
            // connect to MongoDB
            await connectMongo();
            // find all events and return them
            const userTickets = await Ticket.find({ owner: owner }).populate({
                path: "eventDataTrait",
                select: "-img" // Exclude the 'img' field from the eventTrait
            });
            //eventDataTrait is invisible so solve it
            const array_object_visible_fields = [];
            //make event trait visible
            for(let ticket of userTickets){
                array_object_visible_fields.push({
                    owner:ticket.owner,
                    ticketNumber:ticket.ticketNumber,
                    eventContractAdress:ticket.eventContractAdress,
                    user:ticket.used,
                    usedDate:ticket.usedDate,
                    eventTrait:ticket.eventDataTrait
                })
            }
            // const categories = await Category.find().exec();
            if (array_object_visible_fields.length === 0) {
                res.status(404).json({ message: "No rickets found." });
            } else {
                res.status(200).json({tickets:array_object_visible_fields})
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
