import { useRouter } from 'next/router';
import { useContext, useEffect, useState } from 'react';

import { DataContext } from "@/context/DataContext";

import Head from 'next/head'
import Image from 'next/image'
import styles from '@/assets/styles/Pages.module.css'
import styleEvent from '@/assets/styles/Event.module.css'

export default function TicketPage() {
  const [ticket, setTicket] = useState({});
  const router = useRouter();
  const { eventContractAddress, ticketNumber } = router.query;
  const { address } = useContext(DataContext);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    if (eventContractAddress && ticketNumber) {
      // Fetch ticket details using eventContractAddress and ticketNumber
      fetch(`/api/tickets/getTicket?eventContractAddress=${eventContractAddress}&ticketNumber=${ticketNumber}`)
        .then((response) => response.json())
        .then((data) => {
          setTicket(data.ticket);
        })
        .catch((error) => console.error(error))
        .finally(() => setLoading(false));
    }
  }, [eventContractAddress, ticketNumber]);

  return (
    <>
      <Head>
        {loading ? (
          <title>Ticket</title>
        ) : (
          <title>Ticket {ticket.ticketNumber}</title>
        )}
        <meta name="description" content="Ticket details" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <section className={styles.section}>
          <div className={styles.sectionContainer + ' container'}>
            <div className={styles.content}>
              {loading ? (
                <p>Loading ticket...</p>
              ) : (
                <div className={styleEvent.ticket}>
                  <div className={styleEvent.ticketInfo}>
                    <h1>Ticket {ticket.ticketNumber}</h1>
                    <p>Owner: {ticket.owner}</p>
                    <p>Event Contract Address: {ticket.eventContractAdress}</p>
                    <p>Used: {ticket.user ? 'Yes' : 'No'}</p>
                    {ticket.used && <p>Used Date: {ticket.usedDate}</p>}
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
