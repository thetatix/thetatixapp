import { useRouter } from 'next/router';
import { useContext, useEffect, useState } from 'react';

import { DataContext } from "@/context/DataContext";

import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import styles from '@/assets/styles/Pages.module.css'
import styleTicket from '@/assets/styles/Ticket.module.css'

export default function TicketPage() {
  const [ticket, setTicket] = useState({});
  const router = useRouter();
  const { eventContractAddress, ticketNumber } = router.query;
  const { address, bufferToImg, copyToClipboard, formatAddress, formatDateTime, formatDescription } = useContext(DataContext);
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
        <header className={styles.header}>
            <div className={styles.headerContainer + ' container'}>
                <div className={styles.content + ' row'}>
                    <div className='col-12'>
                        <p className={styles.breadcrumbs}>
                            <Link href="/mytickets">My tickets</Link> / <Link href={"/event/" + ticket.eventContractAdress + "/" + ticket.ticketNumber}>{ticket.ticketNumber}</Link>
                        </p>
                        <h1>
                          {loading ? null : (
                            <Link href={"/event/" + ticket.eventContractAdress} target='blank'>
                              {ticket.eventTrait.eventName}
                              <Image
                                src="/icons/external-link.svg"
                                alt="External link icon"
                                width={32}
                                height={32}
                              />
                            </Link>
                          )}
                        </h1>
                    </div>
                </div>
            </div>
        </header>
        <section className={styles.section}>
          <div className={styles.sectionContainer + ' container'}>
            <div className={styles.content}>
              {loading ? (
                <p>Loading ticket...</p>
              ) : (
                <div className={styleTicket.ticket}>
                  <div className={styleTicket.eventImg}>
                      <Image
                          src={bufferToImg(ticket.eventTrait.img)}
                          alt="Event image"
                          width={2400}
                          height={1600}/>
                  </div>
                  <div className={styleTicket.ticketInfo}>
                    <div className={styleTicket.title}>
                      <h1>Ticket: {ticket.ticketNumber}</h1>
                    </div>
                    <div className={styleTicket.creator}>
                        <h2>Owned by</h2>
                        {ticket.owner === address ? (
                          <span onClick={() => copyToClipboard(ticket.owner)} className={styleTicket.you}>
                            <abbr title={ticket.owner}>You</abbr>
                          </span>
                        ) : (
                          <span onClick={() => copyToClipboard(ticket.owner)}>
                            <abbr title={ticket.owner}>
                              {formatAddress(ticket.owner)}
                            </abbr>
                          </span>
                        )}
                    </div>
                    <div className={styleTicket.contractAddress}>
                        <h2>Ticket address</h2>
                        <span onClick={() => copyToClipboard(ticket.eventContractAdress)}>
                            <abbr title={ticket.eventContractAdress}>{formatAddress(ticket.eventContractAdress)}</abbr>
                        </span>
                    </div>
                    <div className={styleTicket.date}>
                        <h2>Date and time</h2>
                        <p>
                            Starts {formatDateTime(ticket.eventTrait.startDate)}
                            <br />
                            Ends {formatDateTime(ticket.eventTrait.endDate)}
                        </p>
                    </div>
                    <div className={styleTicket.location}>
                        <h2>Location</h2>
                        <p>{ticket.eventTrait.location}</p>
                    </div>
                    <div className={styleTicket.description}>
                        <p>{formatDescription(ticket.eventTrait.eventDescription)}</p>
                    </div>

                    <div className={styleTicket.ticketLink}>
                      <button disabled={ticket.user}>
                        {ticket.user ? (
                          'Ticket already used'
                        ): (
                          'Ticket avaible'
                        )}
                      </button>
                    </div>

                    {/* <p>Used: {ticket.user ? 'Yes' : 'No'}</p>
                    {ticket.user && <p>Used Date: {ticket.usedDate}</p>} */}
                    
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
