const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    contractAddress:{
        type:String,
        required: true
    },
    creator: {
        type: mongoose.ObjectId,
        required: true,
        ref: 'user'
    },
    ticketsAmount:{
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
        default: undefined
    },
    category: {
        type: mongoose.ObjectId,
        ref: 'category',
        default: undefined
    }

    
})


const Event = mongoose.models.event || mongoose.model('event',eventSchema);
export default Event;
