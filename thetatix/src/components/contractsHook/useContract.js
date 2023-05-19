import { ethers } from 'ethers';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';

const ABI_file_factory = require('./ABIfactory.json');
const ABI_file_ticket = require('./ABIticket.json');

class useContracts {

    #factoryContract;
    #ABIfactory;
    #ABIticket;
    #signer;

    constructor(_signer){
        this.#signer = _signer;
        this.#ABIfactory = ABI_file_factory.abi;
        this.#ABIticket = ABI_file_ticket.abi;
        this.#factoryContract = new ethers.Contract('0xa0F06733BcA71A433C82d03bD57C7810391c49Cd',this.#ABIfactory,_signer);
    }   

    async working(){
        const data = await this.#factoryContract.working();
        console.log('data',data);
        return data
    }

    async createEventTickets(_creator, _maxTickets, _name, _ticketPrice, _description, _startDate, _img, _endDate, _location, _category,_eventtype,_api_key,_api_secret) {
        if(_creator.length===0){
            return { error: "Wallet not connected.", data: null, status: "warning", message: "Wallet not connected." };   //data = address created contract
        }
        try{
            let streamid = "";
            let stream_key = "";
            let stream_server = "";
            let isOnlineEventStream = false;

            if(_eventtype == "online"){
                //create stream with private keys
                let created_stream;
                isOnlineEventStream = true;
                try{
                    created_stream = await axios({
                        method: "POST",
                        url: "https://api.thetavideoapi.com/stream",
                        headers: {
                        "x-tva-sa-id": _api_key,
                        "x-tva-sa-secret": _api_secret,
                        },
                        body:{
                            name:`thetatix ${_name}`, resolutions:["160p","240p","360p","720p","source"], source_resolution:"720p", "fps":60
                        }
                        
                    });
                }catch(err){
                    return { error: err, data: null, status: "danger", message: "invalid api or secret key, also u may have exceed 3 streams per thetavideoapi private keys" };
                }
                //define needed properties to sotre on backend
                streamid = created_stream.data.body.id;
                stream_key = created_stream.data.body.backup_stream_key;
                stream_server = created_stream.data.body.backup_stream_server
            }
            //create smart contract
            const contract_uuid = uuidv4();

            //create event at blockchain
            const transaction = await this.#factoryContract.createEvent(_name,_description,_ticketPrice,_maxTickets,Date.now(),contract_uuid);
            transaction.wait();
            await this.delay(15);

            //query the address by uuid
            const newEvent_address = await this.#factoryContract.getAddressFromUuid(contract_uuid);

            //push to the db
            const raw_data = {
                contractAddress: newEvent_address,
                creator: _creator,
                ticketsAmount: 0,
                maxTickets: _maxTickets,
                ticketsPrice: _ticketPrice,
                eventName: _name,
                eventDescription: _description,
                startDate: _startDate,
                endDate: _endDate,
                img: _img,
                location: _location,
                category: _category,
                streamid,
                stream_key,
                stream_server,
                isOnlineEventStream
            }
            const data = JSON.stringify({ contractData: raw_data });
            //push to the database address event + data;
            const event = await fetch('/api/event/newEvent', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: data
            });
            if (event.status == 413) {
               return { error: event.statusText, data: null, status: "danger", message: "Image exceeds 1MB limit." };
            }
            return { error: null, data: event, status: "success", message: "Event created successfully." };   //data = address created contract
        }catch(err){
            console.log(err);
            return {error: err, data: null, status: "danger", message: "There was an error creating your event."}

        }
        
        
    }

    async buyTicket(buyerWalletAddress,ticketEventAddress,price){
        if(buyerWalletAddress.length===0){
            return {error:"please connect ur wallet",data:null};   //data = address created contract
        }
        console.log('buyin ticket')
        //buy ticket on smart contract
        const event_contract = new ethers.Contract(ticketEventAddress,this.#ABIticket,this.#signer);
        try{
            await event_contract.buyTicket({value:ethers.utils.parseEther(price.toString())});
            //get user tickets on that smart contract
            const tickets_numbers = await event_contract.getUserTickets(buyerWalletAddress);
            //convert hex array to numbers array
            const parsedNumbers = tickets_numbers.map(ticket => parseInt(ticket._hex,16));
            //add ticket to database 
            const raw_data = {
                eventContractAdress:ticketEventAddress,
                userTickets: parsedNumbers,
                owner:buyerWalletAddress
            }
            const data = JSON.stringify({data: raw_data});
            const event = await fetch('/api/tickets/newTicket',{
                method:'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body:data
            })
            
            return {error:null,data:parsedNumbers} //data = todos los tickets comprados del usuario que lo compro
        }catch(err){
            return {error:err,data:null}
        }
    }

    async ownerWithdrawAmount(receiver_address,ticketEventAddress){
        const event_contract = new ethers.Contract(ticketEventAddress,this.#ABIticket,this.#signer);
        try{
            const amount = await event_contract.amountTickets();
            await event_contract.withdrawAmount(receiver_address);
            return {error:null,data:'success',amount}
        }catch(err){
            return {error:err,data:null}
        }
    }

    async setTicketUsed(ticketEventAddress,ticketNumber,_usedDateString){
        const event_contract = new ethers.Contract(ticketEventAddress,this.#ABIticket,this.#signer);
        try{
            //check if it was alr used 
            const ticket = await event_contract.ticketData(ticketNumber);
            if(ticket.setUsedAdmin===true){
                return {error:"ticket have been already used",data:null};
            }
            //set it used at contract
            await event_contract.setTicketUsed(ticketNumber,_usedDateString);
            //set it used at database
            const raw_data = {
                ticketEventAddress,
                ticketNumber,
                usedDate:_usedDateString
            }
            const data = JSON.stringify({data: raw_data});
            const event = await fetch('/api/tickets/setTicketUsed',{
                method:'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body:data
            })
           return {error:null,data:'success'};
        }catch(err){
            return {error:err,data:null}
        }
    }

    async checkUserOwnNftTicket(onlineEventAddress,userWalletAddress){
        console.log('addressEvent',onlineEventAddress)
        console.log(this.#signer)
        const event_contract = new ethers.Contract(onlineEventAddress,this.#ABIticket,this.#signer);
        const userNftBalance = await event_contract.balanceOf(userWalletAddress);
        return userNftBalance;
    }

    // async updateEventData(ticketEventAddress, _name, _description, _eventDate, _maxTickets, _ticketPrice){
    //     const event_contract = new ethers.Contract(ticketEventAddress,this.#ABIticket,this.#signer);
    //     try{
    //         await event_contract.updateEventData( _name, _description, _eventDate, _maxTickets, _ticketPrice);
    //         return {error:null,data:'success'};
    //      }catch(err){
    //         return {error:err,data:null}
    //     }
    // }

    delay(seconds) {
        return new Promise(resolve => {
          setTimeout(resolve, seconds * 1000);
        });
    }
}

export default useContracts;