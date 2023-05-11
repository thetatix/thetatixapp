import Ticket from "@/server/models/ticket"

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { data } = req.body;
        await Ticket.findOneAndUpdate({
            eventContractAdress:data.ticketEventAddress,
            ticketNumber:ticketNumber
        },{ 
            $set: { used: true }
        })
        const ticket = await Ticket.findOneAndUpdate({
            eventContractAdress:data.ticketEventAddress,
            ticketNumber:ticketNumber
        },{ 
            usedDate: Date.now()
        }) 
        res.status(200).json({data:'succes',ticket})
    }
   
}