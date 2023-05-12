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
            const rpc_url = "https://eth-rpc-api-testnet.thetatoken.org/rpc";
            const private_key = "0x8ed25441e4ef6043ff4f4bc77c0496188f513bdd530de5c510499c68919c9b4f";
            const provider = new ethers.providers.JsonRpcProvider(rpc_url);
            const wallet = new ethers.Wallet(private_key, provider);
            const signer = wallet.connect(provider);
            const  data  = req.body;
            //query from smart contract the data preventing scams
            //la data la recive en un array en vez de objeto nose porque
            const contracts = new ethers.Contract(data.data.contractAddress,ABI_event.abi,signer);
            const eventData = await contracts.getData();
            // const category = mongoose.Types.ObjectId(data.category) || null;
            try{
                //prevent create same event 2 times
                const already_created = await Event.find({
                    contractAddress: data.data.contractAddress,
                })
                if(already_created.length>0){
                    res.status(201).json({ message:'event was already created',data:null })
                }
                const event = await Event.create({
                    contractAddress: data.data.contractAddress,
                    creator: data.data.creator,
                    ticketsAmount: 0,
                    ticketsPrice: parseInt(eventData[4]),
                    maxTickets:parseInt(eventData[5]),
                    eventName: eventData[0],
                    eventDescription: eventData[1],
                    startDate: data.data.startDate,
                    endDate: data.data.endDate,
                    location: data.data.location
                    // category: category
                })
            
                res.status(201).json({ message:'Event created successfully.',data:event })

            }catch(err){
                console.log(err)
                res.status(201).json({ message:'error',data:err })

            }
            
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Unable to create event.' });
        }
    } else {
        res.status(405).json({ message: 'Method not allowed.' });
    }
}

export default handler;