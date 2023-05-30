import { useRouter } from 'next/router';
import { useContext, useEffect, useState } from 'react';
import { ethers } from "ethers"
import { DataContext } from "@/context/DataContext";
import useContracts from '@/components/contractsHook/useContract';
import DynamicModal from '@/components/DynamicModal';
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import styles from '@/assets/styles/Pages.module.css'
import styleEvent from '@/assets/styles/Event.module.css'

export default function EventPage() {
    //STATE MODAL
    const [ModalActive, setModalActive] = useState(false);
    const [ModalStatus, setModalStatus] = useState('loading');
    const [ModalMessage, setModalMessage] = useState('message');
    const [ModalCloseable, setModalCloseable] = useState(false);
    //PAGE STATES
    const [alert, setAlert] = useState(false);
    const [formStatus, setFormStatus] = useState("");
    const [formStatusMsg, setFormStatusMsg] = useState("");
    const router = useRouter();
    const { eventContractAddress } = router.query;
    const { address, isConnected, copyToClipboard, bufferToImg, formatDateTime, formatDescription, formatAddress } = useContext(DataContext);
    const [event, setEvent] = useState({});
    const [category, setCategory] = useState({});

    const submitForm = async (e) => {
        setModalActive(false);
        console.log('Form submitted');
        e.preventDefault();
        //DETERMINAR EL SIGNER DE METAMASK
        console.log('Metamask thing');
        const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
        console.log('Metamask setup');
        if (address.length === 0) {
            setModalActive(true);
            setModalMessage('Please connect your metamask wallet to create an event')
            setModalStatus('danger');
            setModalCloseable(true);
            return
        }
        // Pmetamask setup
        await provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();
        const contract = new useContracts(signer);
        setModalActive(true);
        setModalCloseable(false);
        setModalMessage('Your ticket is being bought. Please DO NOT close, reload, or modify this page, as it may cause your ticket buy process to fail. It might take some time')
        setModalStatus('loading');
        console.log('Contract buyTicket()');
        const eventTicketsPrice = event.ticketsPrice / 1000000;
        try{
            //create ticket
            const response = await contract.buyTicket(
                address,
                event.contractAddress,
                eventTicketsPrice
            )
            console.log('Responded');
            console.log(response);
            setModalMessage('Your ticket has been bought correctly! You can get more details of your ticket at my tickets page!')
            setModalStatus('succes');
            setModalCloseable(true);
            setAlert(true);
            setFormStatus(response.status);
            setFormStatusMsg(response.message);  
        }catch(response){
            setAlert(true);
            setFormStatus(response.status);
            setFormStatusMsg(response.message);  
            setModalMessage(`${response.message} Your event buy process failed, please try again make sure there are available tickets and you have enough tfuel in your account, if you keep having errors dont doubt to contact the support team`)
            setModalStatus('danger');
            setModalCloseable(true);
        }
        
    }
      
      
    

    useEffect(() => {
        if (eventContractAddress) {
            fetch(`/api/event/getEvent?eventContractAddress=${eventContractAddress}`)
            .then((response) => response.json())
            .then((data) => {
                setEvent(data.event);
                return fetch(`/api/category/getCategory?categoryId=${data.event.category}`);
            })
            .then((response) => response.json())
            .then((data) => {
                setCategory(data[0]);
            })
            .catch((error) => console.error(error));
        }
    }, [eventContractAddress]);
    

    if (!event) {
        return <p>Loading event...</p>;
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
                                <Link href="/events">Events</Link> / <Link href={"/category/" + event.category}>{category.categoryName}</Link> / <Link href={"/event/" + event.contractAddress}>{event.eventName}</Link>
                            </p>
                        </div>
                    </div>
                </div>
            </header>
            <section className={styles.section}>
                <div className={styles.sectionContainer + ' container'}>
                    <div className={styles.content}>
                        <form action="/api/tickets/newTicket.js" onSubmit={submitForm} method="POST" className={styleEvent.event}>
                            <div className={styleEvent.eventImg}>
                                <Image
                                    src={bufferToImg(event.img)}
                                    alt="Event image"
                                    width={2400}
                                    height={1600}
                                />
                            </div>
                            <div className={styleEvent.eventInfo}>
                                <div className={styleEvent.title}>
                                    <h1>{event.eventName}</h1>
                                </div>
                                <div className={styleEvent.creator}>
                                    <h2>Created by</h2>
                                    <span onClick={() => copyToClipboard(event.creator)}>
                                        <abbr title={event.creator}>{formatAddress(event.creator)}</abbr>
                                    </span>
                                </div>
                                <div className={styleEvent.contractAddress}>
                                    <h2>Event address</h2>
                                    <span onClick={() => copyToClipboard(event.contractAddress)}>
                                        <abbr title={event.contractAddress}>{formatAddress(event.contractAddress)}</abbr>
                                    </span>
                                </div>
                                <div className={styleEvent.date}>
                                    <h2>Date and time</h2>
                                    <p>
                                        Starts {formatDateTime(event.startDate)}
                                        <br />
                                        Ends {formatDateTime(event.endDate)}
                                    </p>
                                </div>
                                <div className={styleEvent.location}>
                                    <h2>Location</h2>
                                    <p>{event.location}</p>
                                </div>
                                <div className={styleEvent.description}>
                                    <p>{formatDescription(event.eventDescription)}</p>
                                </div>
                                <div className={styleEvent.tickets}>
                                    <p>
                                        Remaining tickets: <span className='ps-2'>{event.maxTickets - event.ticketsAmount}/{event.maxTickets}</span>
                                    </p>
                                </div>
                                <div className={styleEvent.price}>
                                    <span>
                                        {event.ticketsPrice / 1000000} TFUEL
                                    </span>
                                </div>
                                <div className={styleEvent.mint}>
                                    {/* <small className='d-block mb-3 text-start'>
                                        <strong>Ya se mintea el NFT y se agrega a la blockchain, PERO:</strong>
                                        <br />
                                        No se modifica el "ticketsAmount" de la categoria.
                                        <br />
                                        No se agrega el ticket a la base de datos.
                                        <br />
                                        Cuidado al darle "Buy 1 ticket"
                                    </small> */}
                                    {isConnected ? (
                                        <button type='submit' className={styleEvent.mintBtn}>Buy 1 ticket</button>
                                    ) : (
                                        <button className={styleEvent.mintBtn} disabled>Wallet not connected</button>
                                    )}
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </section>
        </main>
    </>
  );
};
