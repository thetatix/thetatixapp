import { ethers } from 'ethers';
import { v4 as uuidv4 } from 'uuid';

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
        this.#factoryContract = new ethers.Contract('0x583B2Ec235984B4256e531aA9Dca64F67dB2D799',this.#ABIfactory,_signer);
    }   

    async working(){
        const data = await this.#factoryContract.working();
        console.log('data',data);
        return data
    }

    async createEventTickets(_name,_description,_ticketPrice,_maxTickets,_startDate,_endDate,_location){
        try{
            const contract_uuid = uuidv4();
            // const contract_uuid = "b1b2f594-4c56-47e9-98a5-d61c6879077d";

            //create event at blockchain
            const transaction = await this.#factoryContract.createEvent(_name,_description,_ticketPrice,_maxTickets,contract_uuid);
            transaction.wait();
            this.delay(5);
            //query the address by uuid
            const newEvent_address = await this.#factoryContract.getAddressFromUuid(contract_uuid);
            //push to the db
            const raw_data = {
                contractAddress:newEvent_address,
                startDate:_startDate,
                endDate:_endDate,
                location:_location
            }
            const data = JSON.stringify({data: raw_data});

            //push to the database address event + data;
            const event = await fetch('/api/event/newEvent',{
                method:'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body:data
            })
            return {error:null,data:event};   //data = address created contract
        }catch(err){
            return {error:err,data:null}

        }
        
        
    }

    async buyTicket(buyerWalletAddress,ticketEventAddress,price){
        //buy ticket on smart contract
        const event_contract = new ethers.Contract(ticketEventAddress,this.#ABIticket,this.#signer);
        try{
            await event_contract.buyTicket({value:ethers.utils.parseEther(price)});
            // await event_contract.wait();
            //get user tickets on that smart contract
            const tickets_numbers = await event_contract.getUserTickets(buyerWalletAddress);
            //convert hex array to numbers array
            const parsedNumbers = tickets_numbers.map(ticket => parseInt(ticket._hex,16));
            //add ticket to database 
            const raw_data = {
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