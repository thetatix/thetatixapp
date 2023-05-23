import { useRouter } from 'next/router';
import { useContext, useEffect, useState } from 'react';
import { ethers } from "ethers"

import { DataContext } from "@/context/DataContext";
import useContracts from '@/components/contractsHook/useContract';

import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import styles from '@/assets/styles/Pages.module.css'
import styleEvent from '@/assets/styles/Event.module.css'

export default function EventPage() {
    const [alert, setAlert] = useState(false);
    const [formStatus, setFormStatus] = useState("");
    const [formStatusMsg, setFormStatusMsg] = useState("");
    const submitForm = async (e) => {
        console.log('Form submitted');
        e.preventDefault();
        //DETERMINAR EL SIGNER DE METAMASK
        console.log('Metamask thing');
        const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
        console.log('Metamask setup');
        // Pmetamask setup
        await provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();
        const contract = new useContracts(signer);

        console.log('Contract buyTicket()');
        const eventTicketsPrice = event.ticketsPrice / 1000000;
        //create ticket
        const response = await contract.buyTicket(
            address,
            event.contractAddress,
            eventTicketsPrice
        )
        console.log('Responded');
        console.log(response);
        setAlert(true);
        setFormStatus(response.status);
        setFormStatusMsg(response.message);
    }

    const formatAddress = (address) => {
        if (address?.length === 42) {
          return address.substring(0, 6) + "..." + address.substring(38);
        } else {
          return address;
        }
      }
    
    function formatDate(rawDate) {
        const date = new Date(rawDate);
        const options = {weekday: 'short', month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC'};
        const formatter = new Intl.DateTimeFormat('en-US', options);
        const utcDateString = formatter.format(date);
        const [dayOfWeek, month, dayOfMonth, year] = utcDateString.split(' ');
        return `${dayOfWeek} ${month} ${dayOfMonth} ${year}`;
    }
      
    function bufferToImg(buffer) {
        if (!buffer) {
            console.log('Buffer is undefined or empty.');
            return '/'; // or any default image URL you want to use
        }
        var img = Buffer.from(buffer, 'base64').toString('ascii');
        return img;
    }
    const router = useRouter();
    const { eventContractAddress } = router.query;
    const { address, setAddress, isConnected, setIsConnected } = useContext(DataContext);
    const [event, setEvent] = useState({});
    const [category, setCategory] = useState({});

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

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text)
        // .then(() => {
        //     console.log('Text copied to clipboard:', text);
        //     // You can show a success message or perform any other actions here
        // })
        // .catch((error) => {
        //     console.error('Error copying text to clipboard:', error);
        //     // You can show an error message or perform any other error handling here
        // });
    };

  return (
    <>
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
                                        Starts {event.startDate}
                                        <br />
                                        Ends {event.endDate}
                                    </p>
                                </div>
                                <div className={styleEvent.location}>
                                    <h2>Location</h2>
                                    <p>{event.location}</p>
                                </div>
                                <div className={styleEvent.description}>
                                    <p>{event.eventDescription}</p>
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
