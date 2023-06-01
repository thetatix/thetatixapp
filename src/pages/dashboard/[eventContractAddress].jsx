import { useRouter } from 'next/router';
import { useContext, useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { DataContext } from "@/context/DataContext";
import useContracts from '@/components/contractsHook/useContract';
import DynamicModal from '@/components/DynamicModal';
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import styles from '@/assets/styles/Pages.module.css'
import styleTickets from '@/assets/styles/Tickets.module.css'

export default function EventPage() {
    //PAGE STATES
    const { address, bufferToImg, formatAddress, copyToClipboard, ModalActive, setModalActive, ModalStatus, setModalStatus, ModalMessage, setModalMessage, ModalCloseable, setModalCloseable } =  useContext(DataContext);

    const formatStreamKey = (key) => {
        const keyLength = key.length;
        return key.substring(0, 6) + "..." + key.substring(keyLength - 4, keyLength);
    }

    const router = useRouter();
    const { eventContractAddress } = router.query;
    const [eventFunds,setEventFunds] = useState(0);
    const [event, setEvent] = useState({});
    const [tickets, setTickets] = useState({});
    const [loading, setLoading] = useState(true);
    const [alert, setAlert] = useState(false);
    const [formStatus, setFormStatus] = useState("");
    const [formStatusMsg, setFormStatusMsg] = useState("");

    const fetchData = () => {
        setLoading(true);
        if (eventContractAddress) {
            fetch(`/api/event/getEvent?eventContractAddress=${eventContractAddress}`)
            .then((response) => response.json())
            .then((data) => {
                setEvent(data.event);
                return fetch(`/api/tickets/getEventTickets?eventContractAddress=${eventContractAddress}`);
            })
            .then((response) => response.json())
            .then((data) => {
                setTickets(data.tickets);
            })
            .catch((error) => console.error(error))
            .finally(() => setLoading(false));
        }
    };

    const getContractData = async () => {
        if (address.length === 0) {
            
            return
        }
        const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
        const signer = provider.getSigner();
        const contract = new useContracts(signer);
        const data = await contract.getEventFundsData(eventContractAddress);
        let amount = parseInt(data.data._hex)/1000000000000000000;
        setEventFunds(amount);  
    }

    useEffect(()=>{
        getContractData();
    },[eventContractAddress,address])

    useEffect(() => {
        fetchData();
    }, [eventContractAddress]);

    const submitForm = async (e, ticketNumber) => {
        e.preventDefault();
        const raw_data = {
          ticketEventAddress: eventContractAddress,
          ticketNumber: ticketNumber
        };
        const data = JSON.stringify({ data: raw_data });
        // Push the event address and data to the database;
        const rawResponse = await fetch('/api/tickets/setTicketUsed', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: data
        });
        const response = await rawResponse.json();
        fetchData();
        setAlert(true);
        setFormStatus(response.status);
        setFormStatusMsg(response.message);
    };    
    //eventContractAddress
    const WithdrawFunds = async (e) => {
        setModalActive(false);
        e.preventDefault();
        //DETERMINAR EL SIGNER DE METAMASK

        const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
        console.log('address length',address.length)
        if (address.length === 0) {
            setModalActive(true);
            setModalMessage('Please connect your metamask wallet to create an event')
            setModalStatus('danger');
            setModalCloseable(true);
            return
        } else {


            // Metamask setup
            setModalMessage('Please Accept Metamask To continue with this progress')
            await provider.send("eth_requestAccounts", []);
            const signer = provider.getSigner();
            const contract = new useContracts(signer);
            setModalActive(true);
            setModalCloseable(false);
            setModalMessage(`${eventFunds}TFUEL are being sent to your account. It might take some time`)
            setModalStatus('loading');
            try {



                const response = await contract.ownerWithdrawAmount(address,eventContractAddress);

                setModalMessage('Your event has been created correctly! You can get more details of your event at my events page!')
                setModalStatus('succes');
                setModalCloseable(true);
                setAlert(true);
                setFormStatus(response.status);
                setFormStatusMsg(response.message);
            } catch (response) {
                setAlert(true);
                setFormStatus(response.status);
                setFormStatusMsg(response.message);
                setModalMessage(`${response.message} Withdraw funds have failed, please contact support team if still having this issue`)
                setModalStatus('danger');
                setModalCloseable(true);
            }
        }
    }

    const StartStream = async (e) => {

    }

  return (
    <>
        <DynamicModal active={ModalActive} status={ModalStatus} message={ModalMessage} closeable={ModalCloseable} />
        <Head>
            <title>{event.eventName}</title>
            <meta name="description" content="Thetatix web app" />
            <link rel="icon" href="/favicon.ico" />
        </Head>
        <main className={styles.main}>
            {alert &&
                <div className={styles.alert + ' ' + formStatus}>
                    <div className="container">
                        <div className={styles.alertContent}>
                            <Image
                                src={"/icons/" + formStatus + ".svg"}
                                alt="Alert icon"
                                width={24}
                                height={24}
                                className={styles.alertIcon}
                            />
                            <p className={styles.alertMessage}>{formStatusMsg}</p>
                            <button className={styles.alertCloseBtn} onClick={() => setAlert(false)}>
                                <Image
                                    src="/icons/close.svg"
                                    alt="Close alert icon"
                                    width={24}
                                    height={24}
                                />
                            </button>
                        </div>
                    </div>
                </div>
            }
            <header className={styles.header}>
                <div className={styles.headerContainer + ' container'}>
                    <div className={styles.content + ' row'}>
                        <div className='col-12'>
                            <p className={styles.breadcrumbs}>
                                <Link href="/dashboard">My created events</Link> / <Link href={"/dashboard/" + event.contractAddress}>{event.eventName}</Link>
                            </p>
                        </div>
                        <div className={styleTickets.headerImg + ' col-2'}>
                            <div className={styleTickets.headerImgContainer}>
                                <Image
                                    src={bufferToImg(event.img)}
                                    alt="Event image"
                                    width={2400}
                                    height={1600}
                                />
                            </div>
                        </div>
                        <div className={styleTickets.headerInfo + ' col-10'}>
                            <div className={styleTickets.headerTitle}>
                                <h1 className={styleTickets.eventTitle}>
                                    <Link href={"/event/" + event.contractAddress} target='blank'>
                                        {event.eventName}
                                        <Image
                                            src="/icons/external-link.svg"
                                            alt="External link icon"
                                            width={32}
                                            height={32}
                                        />
                                    </Link>
                                    {event.isOnlineEventStream && event.creator === address ? (
                                        <Link href={'/onlineevents/' + event.contractAddress} className={styleTickets.startStream}><div onClick={StartStream}>Start stream</div></Link>
                                    ) : null}
                                </h1>
                            </div>
                            {event.creator === address ? (
                                <>
                                    <div className={styleTickets.headerContractAddress}>
                                        <h2>Event address</h2>
                                        <span onClick={() => copyToClipboard(event.contractAddress)}>
                                            <abbr title={event.contractAddress}>{formatAddress(event.contractAddress)}</abbr>
                                        </span>
                                    </div>
                                    <div className={styleTickets.headerEarnings}>
                                        <h2>Total event earnings</h2>
                                        <p>{(event.ticketsPrice / 1000000) * event.ticketsAmount} TFUEL</p>
                                    </div>
                                    <div className={styleTickets.headerTicketsNumber}>
                                        <h2>Remaining tickets</h2>
                                        <p>
                                            {event.maxTickets - event.ticketsAmount} / {event.maxTickets}
                                        </p>
                                    </div>
                                    {event.isOnlineEventStream ? (
                                        <div className={styleTickets.headerStreamKey}>
                                            <span onClick={() => copyToClipboard(event.stream_key)}>
                                                <abbr title={event.stream_key}>Stream key: {formatStreamKey(event.stream_key)}</abbr>
                                            </span>
                                        </div>
                                    ) : null}
                                    <div className={styleTickets.headerFundsBtn}>
                                        <div>{eventFunds} TFUEL available <button onClick={WithdrawFunds}>Withdraw funds</button></div>
                                        {event.isOnlineEventStream ? (
                                            <span onClick={() => copyToClipboard(event.stream_server)}>
                                                <abbr title={event.stream_server}>Stream server: {event.stream_server}</abbr>
                                            </span>
                                        ) : null}
                                    </div>
                                </>
                            ) : (
                                <p className='pt-3'>You are not the owner of this event.</p>
                            )}
                        </div>
                    </div>
                </div>
            </header>
            <section className={styles.section}>
                <div className={styles.sectionContainer + ' container'}>
                    <div className={styleTickets.ticketsContent}>
                        {event.creator === address ? (
                            <div className={styleTickets.tickets}>
                                <div className={styleTickets.ticketHead}>
                                    <div className={styleTickets.ticketNumber}>
                                        <h3>Ticket #</h3>
                                    </div>
                                    <div className={styleTickets.ticketOwner}>
                                        <h3>Owner's Address</h3>
                                    </div>
                                    <div className={styleTickets.ticketAction}>
                                        <h3>Action</h3>
                                    </div>
                                </div>
                                {loading ? (
                                    <p>Loading tickets...</p>
                                ) : (tickets && tickets.length > 0 ? (
                                        tickets.map((ticket) => {
                                            return (
                                                <form action='/api/tickets/setTicketUsed' onSubmit={(e) => submitForm(e, ticket.ticketNumber)} method='PUT' key={ticket.ticketNumber} className={styleTickets.ticket}>
                                                    <div className={styleTickets.ticketNumber}>
                                                        <p>{ticket.ticketNumber}</p>
                                                    </div>
                                                    <div className={styleTickets.ticketOwner}>
                                                        <p>{ticket.owner}</p>
                                                    </div>
                                                    {!event.isOnlineEventStream && (
                                                        <div className={styleTickets.ticketAction}>
                                                            {ticket.user ? (
                                                                <button id={'registerBtn'+ ticket.ticketNumber} disabled>Entrant registered</button>
                                                            ) : (
                                                                <button id={'registerBtn'+ ticket.ticketNumber}>Register entrant</button>
                                                            )}
                                                            {/* Ticket used
                                                            <br />
                                                            used date: {ticket.usedDate} */}
                                                        </div>
                                                    )}
                                                </form>
                                            )
                                        })
                                    ) : (
                                        <p>No tickets found</p>
                                    )
                                )}
                            </div>
                        ) : null}
                    </div>
                </div>
            </section>
        </main>
    </>
  );
};
