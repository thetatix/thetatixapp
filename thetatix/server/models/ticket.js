const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
    eventContractAdress: {
        type: String,
        required: true
    },
    owner:{
        type: String,//adress of wallet owner
        required: true
    },
    ticketNumber: {
        type: Number,
        required: true
    },
    used: {
        type: Boolean,
        default: false
    }
})

const Ticket = mongoose.models.ticket || mongoose.model('ticket',ticketSchema);
export default Ticket;
