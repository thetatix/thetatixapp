import connectMongo from '@/server/mongo';
import Event from '@/server/models/event';

const handler = async (req, res) => {
    if (req.method === 'GET') {
        try {
            const { eventContractAddress } = req.query;
            await connectMongo();
            //get event
            const event = await Event.findOne({ contractAddress: eventContractAddress });
            //check event exists
            if (!event) {
                res.status(404).json({ message: 'Event not found.', data: null,error: true });
            } else {
                //check event is online event
                if(event.isOnlineEventStream===false){
                    res.status(404).json({ message: 'Event its not online', data: null,error: true });
                }
                //get the playback_url
                let event_data;
                try{
                    const event_data_raw = await axios({
                        method: "GET",
                        url: `https://api.thetavideoapi.com/stream/${event.stream_id}`,
                        headers: {
                        "x-tva-sa-id": "srvacc_t0zg8xkd49pinx8tfdac2w4w0",
                        "x-tva-sa-secret": "pu6aam24dacwpuag2kzbxigcxmu8gvvv",
                        },
                        body:{
                            name:`thetatix ${_name}`, resolutions:["160p","240p","360p","720p","source"], source_resolution:"720p", "fps":60
                        }
                        
                    });
                    event_data = event_data_raw.data.body;
                }catch(err){
                    return { error: err, data: null, status: "danger", message: "invalid api or secret key, also u may have exceed 3 streams per thetavideoapi private keys" };
                }
                console.log('---event data',event_data)
                // const playback_url = event_data;
                //return playback url if event its on
                res.status(200).json({ message:'', data: event , error: false});
            }
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Unable to fetch event.',data: null,error: true });
        }
    } else {
        res.status(405).json({ message: 'Method not allowed.', data: null });
    }
};

export default handler;
