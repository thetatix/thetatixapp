import Ticket from "@/server/models/ticket"
import connectMongo from "@/server/mongo";
import Event from "@/server/models/event";
export default async function handler(req, res) {
    if (req.method === 'POST') {
        await connectMongo();
        const  data  = req.body.data;
        //get actual user tickets
        const existing_tickets = await Ticket.find({
            eventContractAdress:data.eventContractAdress,
            owner: data.owner
        });
        //parse the old tickets vs new tickets amount and add the new tickets to the database
        const parsed_existing_tickets = [];
        for(let ticket of existing_tickets){
            parsed_existing_tickets.push(ticket.ticketNumber);
        }

        let difference = data.userTickets.filter(x => !parsed_existing_tickets.includes(x));
        //add new tickets to database
        for(let ticketNumber of difference){
            //prevent create same ticket 2 times
            const existing_tickets = await Ticket.find({
                eventContractAdress:data.eventContractAdress,
                ticketNumber
            });
            
            if(existing_tickets.length>0){
                return
            }
            console.log('test1',{contractAddress:data.eventContractAdress})

            //create ticket
            await Ticket.create({
                eventContractAdress:data.eventContractAdress,
                owner: data.owner,
                ticketNumber
            })
            console.log({contractAddress:data.eventContractAdress})
            //add money to ticket
            await Event.updateOne({
                contractAddress:data.eventContractAdress,
            },{
                $inc: { ticketsAmount: 1 } 
            })
        }
        res.status(200).json({ status:'success', message: 'Ticket bought successfully.' })
    } else {
        res.status(405).json({ status: 'danger', message: 'Method not allowed.' });
    }
}