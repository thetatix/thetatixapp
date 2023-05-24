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
            res.status(200).json({data:'succes',ticket})
        } catch(err) {
            console.error(err);
            res.status(500).json({ message: "Unable to fetch tickets." });
        }
    } else {
        res.status(405).json({ message: 'Method not allowed.' });
    }
}

export default handler;

// export default async function handler(req, res) {
//     if (req.method === 'PUT') {
//         await connectMongo();
//         const  data  = req.body.data;
        
//         await Ticket.findOneAndUpdate({
//             eventContractAdress:data.ticketEventAddress,
//             ticketNumber: Number(data.ticketNumber)
//         },{ 
//             $set: { used: true }
//         })
//         const ticket = await Ticket.findOneAndUpdate({
//             eventContractAdress:data.ticketEventAddress,
//             ticketNumber:Number(data.ticketNumber)
//         },{ 
//             usedDate: Date.now()
//         }) 
//         res.status(200).json({data:'succes',ticket})
//     }
   
// }