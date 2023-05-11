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
        type:{type:String},
        coordinates:[Number],
        default: {}
    },
    category: {
        type: mongoose.ObjectId,
        ref: 'category',
        default: undefined
    }

    
})


const Event = mongoose.models.event || mongoose.model('event',eventSchema);
export default Event;
