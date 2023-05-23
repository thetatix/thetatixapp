import { useContext, useEffect, useState } from "react";
import { DataContext } from "@/context/DataContext";

import Head from 'next/head'
import EventCard from '@/components/EventCard'
import styles from '@/assets/styles/Pages.module.css'
import styleCards from '@/assets/styles/Cards.module.css'

export default function MyTickets() {
  const { address, setAddress, isConnected, setIsConnected } =  useContext(DataContext);
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
                                console.log(ticket.eventTrait);
                                return (
                                    <div className={styleCards.ticketCard + ' col-12 my-5'}>
                                        <div className={styleCards.ticket}>
                                            <div className={styleCards.ticketImg}></div>
                                            <div className={styleCards.ticketInfo}>
                                                <div className={styleCards.ticketHeader}>
                                                    ticket
                                                    <h1>{ticket.eventTrait.eventName}</h1>
                                                    <p>{ticket.ticketNumber}</p>
                                                </div>
                                                <div className={styleCards.ticketDate}>
                                                    <p>{ticket.eventTrait.startDate}</p>
                                                    <p>{ticket.eventTrait.endDate}</p>
                                                </div>
                                                <div className={styleCards.ticketLocation}>
                                                    <p>{ticket.eventContractAdress}</p>
                                                    <p>{ticket.user}</p>
                                                </div>
                                                <div className={styleCards.ticketBottom}>
                                                    <p>{ticket.usedDate}</p>
                                                    <p>{ticket.eventTrait.eventName}</p>
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
