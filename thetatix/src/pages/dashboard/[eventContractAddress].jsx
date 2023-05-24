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
    const router = useRouter();
    const { eventContractAddress } = router.query;
    const [event, setEvent] = useState({});
    const [tickets, setTickets] = useState({});
    const [loading, setLoading] = useState(true);
    const [alert, setAlert] = useState(false);
    const [formStatus, setFormStatus] = useState("");
    const [formStatusMsg, setFormStatusMsg] = useState("");

    useEffect(() => {
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
    }, [eventContractAddress]);

    const submitForm = async (e, ticketNumber) => {
        e.preventDefault();
        const raw_data = {
          ticketEventAddress: eventContractAddress,
          ticketNumber: ticketNumber
        };
        const data = JSON.stringify({ data: raw_data });
        // Push the event address and data to the database;
        const response = await fetch('/api/tickets/setTicketUsed', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: data
        });
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
                            </h1>
                        </div>
                    </div>
                </div>
            </header>
            <section className={styles.section}>
                <div className={styles.sectionContainer + ' container'}>
                    <div className={styleTickets.ticketsContent}>
                        {event.creator === address ? (
                            <div className={styleTickets.tickets}>
                                <div className={styleTickets.ticket}>
                                    <div className={styleTickets.ticketCol}>
                                        <h3>Event</h3>
                                    </div>
                                    <div className={styleTickets.ticketCol}>
                                        <h3>Ticket ID</h3>
                                    </div>
                                    <div className={styleTickets.ticketCol}>
                                        <h3>Wallet Address</h3>
                                    </div>
                                    <div className={styleTickets.ticketCol}>
                                        <h3>Cost</h3>
                                    </div>
                                    <div className={styleTickets.ticketCol}>
                                        <h3>Action</h3>
                                    </div>
                                </div>
                                {loading ? (
                                    <p>Loading tickets...</p>
                                ) : (tickets && tickets.length > 0 ? (
                                        tickets.map((ticket) => {
                                            return (
                                                <form action='/api/tickets/setTicketUsed' onSubmit={(e) => submitForm(e, ticket.ticketNumber)} method='PUT' key={ticket.ticketNumber} className={styleTickets.ticket}>
                                                    <div className={styleTickets.ticketCol}>
                                                        <Image
                                                            src={bufferToImg(event.img)}
                                                            alt="Event image"
                                                            width={2400}
                                                            height={1600}
                                                        />
                                                    </div>
                                                    <div className={styleTickets.ticketCol}>
                                                        number: {ticket.ticketNumber}
                                                    </div>
                                                    <div className={styleTickets.ticketCol}>
                                                        owner: {ticket.owner}
                                                    </div>
                                                    <div className={styleTickets.ticketCol}>
                                                        price {(event.ticketsPrice / 1000000)}
                                                    </div>
                                                    <div className={styleTickets.ticketCol}>
                                                        {ticket.user ? (
                                                            <button disabled>
                                                                Ticket used
                                                                <br />
                                                                used date: {ticket.usedDate}
                                                            </button>
                                                        ) : (
                                                            <button>Register entrant</button>
                                                        )}
                                                    </div>
                                                </form>
                                            )
                                        })
                                    ) : (
                                        <p>No tickets found</p>
                                    )
                                )}
                            </div>
                        ) : (
                            <p>You are not the owner of this event</p>
                        )}
                    </div>
                </div>
            </section>
        </main>
    </>
  );
};
