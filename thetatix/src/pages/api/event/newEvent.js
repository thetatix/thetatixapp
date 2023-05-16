import connectMongo from '@/server/mongo';
import Event from '@/server/models/event';
import mongoose from 'mongoose';
import { ethers } from 'ethers';

const ABI_event = require("../../../components/contractsHook/ABIticket.json");

const handler = async (req, res) => {
    if (req.method === 'POST') {
        try {
            await connectMongo();
            
            //wallet setup for query data of the smart contract
            // const rpc_url = "https://eth-rpc-api-testnet.thetatoken.org/rpc";
            // const private_key = "0x8ed25441e4ef6043ff4f4bc77c0496188f513bdd530de5c510499c68919c9b4f";
            // const provider = new ethers.providers.JsonRpcProvider(rpc_url);
            // const wallet = new ethers.Wallet(private_key, provider);
            // const signer = wallet.connect(provider);
            const data  = req.body;
            //query from smart contract the data preventing scams
            //la data la recive en un array en vez de objeto nose porque
            // const contracts = new ethers.Contract(data.data.contractAddress,ABI_event.abi,signer);
            // const eventData = await contracts.getData();
            const mongoCategory = new mongoose.Types.ObjectId(data.contractData.category) || null;
            try{
                //prevent create same event 2 times
                // const already_created = await Event.find({
                //     contractAddress: data.data.contractAddress,
                // })
                // if(already_created.length>0){
                //     res.status(201).json({ message:'event was already created',data:null })
                // }
                const event = await Event.create({
                    contractAddress: data.contractData.contractAddress,
                    creator: data.contractData.creator,
                    ticketsAmount: 0,
                    // maxTickets:parseInt(eventData[5]),
                    maxTickets: data.contractData.maxTickets,
                    // ticketsPrice: parseInt(eventData[4]),
                    ticketsPrice: data.contractData.ticketsPrice,
                    // eventName: eventData[0],
                    eventName: data.contractData.eventName,
                    // eventDescription: eventData[1],
                    eventDescription: data.contractData.eventDescription,
                    startDate: data.contractData.startDate,
                    endDate: data.contractData.endDate,
                    img: data.contractData.img,
                    location: data.contractData.location,
                    category: mongoCategory
                })
            
                res.status(201).json({ error: null, data: event, status: "success", message:'Event created successfully.' })

            }catch(err){
                console.log(err);
                res.status(500).json({ error: err, data: null, status: "danger", message:'Error pushing event to database' });

            }
            
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: err, data: null, status: "danger", message: 'Unable to create event.' });
        }
    } else {
        res.status(405).json({ error: "Method not allowed", data: null, status: "danger", message: 'Method not allowed.' });
    }
}

export default handler;