import { useState } from "react";
import Image from 'next/image'
import Link from 'next/link'
import styles from '@/assets/styles/Dashboard.module.css'

function bufferToImg(buffer) {
    if (!buffer) {
        return '/';
    }
    var img = Buffer.from(buffer, 'base64').toString('ascii');
    return img;
}

export default function DashboardCard({ num, headTitle, events }) {
    const [isCollapsed, setIsCollapsed] = useState(false);

    const handleToggleCollapse = () => {
        setIsCollapsed(!isCollapsed);
    };

    return (
        <div className={styles.content + ' row'}>
            <div className={styles.head + ' col-2'}>
                <h2>{headTitle}</h2>
            </div>
            <div className={styles.eventCards + ' col'}>
                {(events.slice(0, 2)).map((event) => (
                    <Link href={'/dashboard/' + event.contractAddress} className={styles.eventCard} key={event.contractAddress}>
                        <div className={styles.event}>
                            <div className={styles.eventImg}>
                                <Image
                                    src={bufferToImg(event.img)}
                                    alt="Event image"
                                    width={2400}
                                    height={1600}
                                />
                            </div>
                            <div className={styles.eventInfo}>
                                <div className={styles.title}>
                                    <h4>{event.eventName}</h4>
                                </div>
                                <div className={styles.action}>
                                    <button>Registrer entrants</button>
                                </div>
                            </div>
                        </div>
                    </Link>
                ))}
                {events.length >= 3 ? (
                    <div id={'accordionNum' + num} className={styles.eventCards + ' col-12 collapse'}>
                        {(events.slice(2)).map((event) => (
                            <Link href={'/dashboard/' + event.contractAddress} className={styles.eventCard} key={event.contractAddress}>
                                <div className={styles.event}>
                                    <div className={styles.eventImg}>
                                        <Image
                                            src={bufferToImg(event.img)}
                                            alt="Event image"
                                            width={2400}
                                            height={1600}
                                        />
                                    </div>
                                    <div className={styles.eventInfo}>
                                        <div className={styles.title}>
                                            <h4>{event.eventName}</h4>
                                        </div>
                                        <div className={styles.action}>
                                            <button>Registrer entrants</button>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : null}
            </div>
            {events.length >= 3 ? (
                <>
                    <div className={styles.toggleAccordion + ' col-1'}>
                        <button data-bs-toggle="collapse" data-bs-target={'#accordionNum' + num} aria-expanded="false" aria-controls={'accordionNum' + num} className="collapsed">
                            <div className={styles.toggleIcon}>
                                <Image
                                    src="/icons/chevron.svg"
                                    alt="Chevron icon"
                                    width={40}
                                    height={40}
                                />
                            </div>
                            <br />
                            <p>View all</p>
                            <span>Show less</span>
                        </button>
                    </div>
                </>
            ) : null}
        </div>
    )
}