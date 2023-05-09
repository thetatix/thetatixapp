import { useEffect, useState } from "react";
import Image from 'next/image'
import Link from 'next/link'
import styles from '@/assets/styles/Navbar.module.css'

export default function Navbar() {
  const [clientWindowHeight, setClientWindowHeight] = useState("");

  const [boxShadow, setBoxShadow] = useState(0);

  useEffect(() => {
    window.addEventListener("scroll", navbarOnScroll);
    return () => window.removeEventListener("scroll", navbarOnScroll);
  });

  const navbarOnScroll = () => {
    setClientWindowHeight(window.scrollY);
  };

  useEffect(() => {
    if (clientWindowHeight > 10) {
      let boxShadowVar = 0.03;
      setBoxShadow(boxShadowVar);
    } else {
      let boxShadowVar = 0;
      setBoxShadow(boxShadowVar);
    }
  }, [clientWindowHeight]);


  return (
    <nav className={styles.nav} style={{boxShadow: `0px 4px 15px rgb(0 0 0 / ${boxShadow})`,}}>
      <div className={styles.navbarContainer + ' container'}>
        <div className={styles.content}>
          <div className={styles.logo}>
            <Link href="/" className={styles.logoImg}>
              <Image
                src="/next.svg"
                alt="Thetatix Logo"
                width={180}
                height={37}
                priority
              />
            </Link>
          </div>
          <div className={styles.center}>
            <ul>
              <li>
                <Link href="/" className={styles.navLink}>
                  My tickets
                </Link>
              </li>
              <li>
                <Link href="/events" className={styles.navLink}>
                  Events
                </Link>
              </li>
              <li>
                <Link href="/" className={styles.navLink}>
                  Create an event
                </Link>
              </li>
            </ul>
            <div className={styles.searchBar}></div>
          </div>
          <div className={styles.connectBtn}>
            <button>Connect wallet</button>
          </div>
        </div>
      </div>
    </nav>
  )
}
