import connectMongo from '@/server/mongo';
import Category from '@/server/models/category';
// const ABI_event = require("../../../components/contractsHook/ABIticket.json");

const handler = async (req, res) => {
    if (req.method === 'POST') {
        try {
            await connectMongo();
            //query from smart contract the data preventing scams
            // const rpc_url = "https://eth-rpc-api-testnet.thetatoken.org/rpc";
            // const private_key = "0x8ed25441e4ef6043ff4f4bc77c0496188f513bdd530de5c510499c68919c9b4f";
            // const provider = new ethers.providers.JsonRpcProvider(rpc_url);
            // const wallet = new ethers.Wallet(private_key, provider);
            // const signer = wallet.connect(provider);

            const { data } = req.body;
            console.log(data);
            // const contracts = new ethers.Contract(data.contractAddress,ABI_event,signer);
            // const eventData = await contracts.getData();
            
            const category = await new Category({
                categoryName: data.categoryName,
                categoryDescription: data.categoryDescription,
                img: data.img
            })
            
            await category.save();
            res.status(201).json({ message:'Category created successfully.', data: category })
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Unable to create category.' });
        }
    } else {
        res.status(405).json({ message: 'Method not allowed.' });
    }
}

export default handler;