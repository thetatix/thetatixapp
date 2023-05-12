import Ticket from "@/server/models/ticket"
import connectMongo from "@/server/mongo";

export default async function handler(req, res) {
    if (req.method === 'POST') {
        await connectMongo();
        const  data  = req.body.data;
        
        await Ticket.findOneAndUpdate({
            eventContractAdress:data.ticketEventAddress,
            ticketNumber: Number(data.ticketNumber)
        },{ 
            $set: { used: true }
        })
        const ticket = await Ticket.findOneAndUpdate({
            eventContractAdress:data.ticketEventAddress,
            ticketNumber:Number(data.ticketNumber)
        },{ 
            usedDate: Date.now()
        }) 
        res.status(200).json({data:'succes',ticket})
    }
   
}