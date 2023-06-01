const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    contractAddress:{ //adress of the contract event
        type:String,
        required: true
    },
    creator: { //adress of creator
        type:String,
        required: true
    },
    ticketsAmount:{
        type: Number,
        required: true,
        default: 0
    },
    maxTickets:{
        type: Number,
        required: true,
        default: 0
    },
    ticketsPrice:{
        type: Number,
        required: true,
        default: 0
    },
    eventName:{
        type: String,
        required: true
    },
    eventDescription:{
        type: String,
        required: true
    },
    startDate: {
        required: true,
        type: Date
    },
    endDate: {
        required: true,
        type: Date
    },
    img: {
        type: Buffer
    },//??temporal,
    location : {
        type:String,
        default: undefined
    },
    category: {
        type: mongoose.ObjectId,
        ref: 'category',
        default: undefined
    },
    isOnlineEventStream:{//es event online o presencial
        type:Boolean,
        default:false
    },
    stream_key:{//private key para hacer stream
        type:String,
        default:''
    },
    stream_id:{//stream id 
        type:String,
        default:''
    },
    stream_server:{//servidor del stream de theta
        type:String,
        default:'rtmp://live5in.thetavideoapi.com/live'
    },
    stream_status:{//activo o inactivo
        type:String,
        default:'off'//off || on
    },
    stream_playback_url:{//url del stream
        type:String,
        default:''
    }

    
})


const Event = mongoose.models.event || mongoose.model('event',eventSchema);
export default Event;
