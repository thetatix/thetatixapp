import Ticket from "@/server/models/ticket"
import connectMongo from "@/server/mongo";

const handler = async (req, res) => {
    if (req.method === 'PUT') {
        try {
            await connectMongo();
            const  data  = req.body.data;
            console.log(data);

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
            res.status(200).json({ status:'success', message: "Registered entrant successfully.", ticket });
        } catch(err) {
            console.error(err);
            res.status(500).json({ status: 'danger', message: "Unable to register entrant." });
        }
    } else {
        res.status(405).json({ status: 'danger', message: 'Method not allowed.' });
    }
}

export default handler;