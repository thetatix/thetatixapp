import { useRouter } from 'next/router';
import { useContext, useEffect, useState } from 'react';
import { DataContext } from "@/context/DataContext";

import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import styles from '@/assets/styles/Pages.module.css'
import styleTickets from '@/assets/styles/Tickets.module.css'

export default function EventPage() {
    const { address } =  useContext(DataContext);

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
            return '/'; // or any default image URL you want to use
        }
        var img = Buffer.from(buffer, 'base64').toString('ascii');
        return img;
    }

    const formatAddress = (address) => {
        if (address?.length === 42) {
          return address.substring(0, 6) + "..." + address.substring(38);
        }
        return address;
    }

    const formatStreamKey = (key) => {
        const keyLength = key.length;
        return key.substring(0, 6) + "..." + key.substring(keyLength - 4, keyLength);
    }

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
    };

    const router = useRouter();
    const { eventContractAddress } = router.query;
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
                                    {event.isOnlineEventStream ? (
                                        <button className={styleTickets.startStream}>Start stream</button>
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
                                        <button>Withdraw funds</button>
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
