import { useContext, useEffect, useState } from "react";
import { DataContext } from "@/context/DataContext";

import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import styles from '@/assets/styles/Pages.module.css'
import styleCards from '@/assets/styles/Cards.module.css'

export default function MyTickets() {
    const { address, formatDateTime, bufferToImg } =  useContext(DataContext);
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        setLoading(true);
        Promise.all([
            fetch(`/api/tickets/getUserTickets?owner=` + address)
                .then((response) => response.json())
                .then((data) => setTickets(data.tickets))
        ])
        .catch((error) => console.error(error))
        .finally(() => setLoading(false));
    }, [address]);

  return (
    <>
        <Head>
            <title>My tickets</title>
            <meta name="description" content="Thetatix web app" />
            <link rel="icon" href="/favicon.ico" />
        </Head>
        <main className={styles.main}>
            <header className={styles.header}>
                <div className={styles.headerContainer + ' container'}>
                    <div className={styles.content + ' row'}>
                        <div className="col-12">
                            <h1>My tickets</h1>
                            <p>Check your past and future events.</p>
                        </div>
                    </div>
                </div>
            </header>
            {/* events */}
            <section className={styles.section}>
                <div className={styles.sectionContainer + ' container'}>
                    <div className={styleCards.contentTicketCards + ' row'}>
                    {/* Correcto: */}
                    {loading ? (
                        <p>Loading tickets...</p>
                    ) : (tickets && tickets.length > 0 ? (
                            tickets.map((ticket) => {
                                return (
                                    <div className={styleCards.ticketCard + ' col-12'}>
                                        <div className={styleCards.ticket}>
                                            <div className={styleCards.ticketImg}>
                                                <Image
                                                    src={bufferToImg(ticket.eventTrait.img)}
                                                    alt="Event image"
                                                    width={2400}
                                                    height={1600}
                                                />
                                            </div>
                                            <div className={styleCards.ticketInfo}>
                                                <div className={styleCards.ticketTitle}>
                                                    <h1>
                                                        <Link href={'/event/' + ticket.eventTrait.contractAddress} target="_blank">{ticket.eventTrait.eventName}</Link>
                                                        <Image
                                                            src="/icons/external-link.svg"
                                                            alt="External link icon"
                                                            width={32}
                                                            height={32}
                                                        />
                                                    </h1>
                                                </div>
                                                <div className={styleCards.ticketId}>
                                                    <h2>Ticket ID</h2>
                                                    <p>{ticket.ticketNumber}</p>
                                                </div>
                                                <div className={styleCards.ticketDate}>
                                                    <h2>Date and time</h2>
                                                    <p>Starts {formatDateTime(ticket.eventTrait.startDate)}</p>
                                                    <p>Ends {formatDateTime(ticket.eventTrait.endDate)}</p>
                                                </div>
                                                <div className={styleCards.ticketLocation}>
                                                    <h2>Location</h2>
                                                    <p>{ticket.eventTrait.location}</p>
                                                </div>
                                                <div className={styleCards.ticketLink}>
                                                    <Link href={"/event/" + ticket.eventTrait.contractAddress + "/" + ticket.ticketNumber}>
                                                        Show ticket
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })
                        ) : (
                            <p>No tickets found</p>
                        )
                    )}
                    
                    </div>
                </div>
            </section>
        </main>
    </>
  );
}
