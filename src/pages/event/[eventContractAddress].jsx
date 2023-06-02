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
    //PAGE STATES
    const router = useRouter();
    const { eventContractAddress } = router.query;
    const { address, isConnected, copyToClipboard, bufferToImg, formatDateTime, formatDescription, formatAddress, setModalActive, setModalStatus, setModalMessage, setModalCloseable } = useContext(DataContext);
    const [event, setEvent] = useState({});
    const [category, setCategory] = useState({});

    const submitForm = async (e) => {
        e.preventDefault();
        setModalActive(true);
        //DETERMINAR EL SIGNER DE METAMASK
        const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
        if (!isConnected) {
            setModalActive(true);
            setModalStatus('danger');
            setModalMessage('Please connect your wallet to continue.');
            setModalCloseable(true);
            return
        }
        // Pmetamask setup
        await provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();
        const contract = new useContracts(signer);
        setModalActive(true);
        setModalStatus('loading');
        setModalCloseable(false);
        setModalMessage('Your ticket is being bought. Please DO NOT close, reload, or modify this page, as it may cause your ticket buy process to fail. It might take some time.')
        const eventTicketsPrice = event.ticketsPrice / 1000000;
        try{
            //create ticket
            const response = await contract.buyTicket(
                address,
                event.contractAddress,
                eventTicketsPrice
            );
            setModalStatus(response.status);
            setModalMessage(response.message);
            setModalCloseable(true);
        } catch(err) {
            setModalStatus("danger");
            setModalMessage('Your buy ticket process failed, please try again make sure there are available tickets and you have enough TFUEL in your account, if you keep having errors dont doubt to contact the support team.');
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
        <DynamicModal />
        <Head>
            <title>{event.eventName}</title>
            <meta name="description" content="Thetatix web app" />
            <link rel="icon" href="/favicon.ico" />
        </Head>
        <main className={styles.main}>
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
                                    {event.isOnlineEventStream ? (
                                        <p>Online event</p>
                                        ) : (
                                        <p>{event.location}</p>
                                    )}
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
