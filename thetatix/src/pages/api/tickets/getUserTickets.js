import Ticket from "@/server/models/ticket"
import Event from "@/server/models/event";
import connectMongo from "@/server/mongo";


export default async function handler(req, res) {
    await connectMongo();
    const { owner } = req.query;
    const userTickets = await Ticket.find({
        owner:owner
    }).populate("eventDataTrait");
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
    res.status(200).json({data:array_object_visible_fields})
}