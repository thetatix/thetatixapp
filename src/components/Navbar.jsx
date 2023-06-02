
'use client';

import { useRouter } from 'next/router';
import { useContext, useEffect, useState } from "react";
import { DataContext } from "@/context/DataContext";
import Image from 'next/image'
import Link from 'next/link'
import styles from '@/assets/styles/Navbar.module.css'

import SearchBar from '@/components/SearchBar';


export default function Navbar() {

  const router = useRouter();
  const [isFixed, setIsFixed] = useState(true);
  useEffect(() => {
    const isOnlineEventsPage = router.pathname.includes('/onlineevents');
    setIsFixed(!isOnlineEventsPage);
  }, [router]);

  const { theme, setTheme, formatAddress } = useContext(DataContext);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    changeTheme(savedTheme);
  }, []);

  const changeTheme = (newTheme) => {
    setTheme(newTheme);
    document.documentElement.className = (newTheme);
  };

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    document.documentElement.className = (newTheme);
  };
  // const setTheme = theme => document.documentElement.className = theme;

  const [error, setError] = useState();

  const networks = {
    thetatestnet: {
      chainId: `0x${Number(365).toString(16)}`,
      chainName: "Theta Testnet",
      nativeCurrency: {
        name: "TFUEL",
        symbol: "TFUEL",
        decimals: 18
      },
      rpcUrls: ["https://eth-rpc-api-testnet.thetatoken.org/rpc"],
      blockExplorerUrls: ["https://testnet-explorer.thetatoken.org/"]
    },
    theta: {
      chainId: `0x${Number(361).toString(16)}`,
      chainName: "Theta Mainnet",
      nativeCurrency: {
        name: "TFUEL",
        symbol: "TFUEL",
        decimals: 18
      },
      rpcUrls: ["https://eth-rpc-api.thetatoken.org/rpc"],
      blockExplorerUrls: ["https://explorer.thetatoken.org/"]
    }
  }

  const changeNetwork = async ({ networkName, setError }) => {
    try {
      if (!window.ethereum) throw new Error("No crypto wallet found");
      await window.ethereum.request({
        method: "wallet_addEthereumChain",
        params: [
          {
            ...networks[networkName]
          }
        ]
      });
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: networks[networkName].chainId }]
      });
    } catch (err) {
      setError(err.message);
    }
  };

  const handleNetworkSwitch = async (networkName) => {
    setError();
    await changeNetwork({ networkName, setError });
  };

  const networkChanged = (chainId) => {
    console.log({ chainId });
  }

  useEffect(() => {
    if (typeof window.ethereum !== 'undefined') {
      window.ethereum.on("chainChanged", networkChanged);
      return () => {
        window.ethereum.removeListener("chainChanged", networkChanged);
      };
    }
  }, []);
  
  const { address, setAddress, isConnected, setIsConnected, username, setUsername } =  useContext(DataContext);

  const connectMetamask = async () => {
    if (window.ethereum) {
      try {
        await window.ethereum.request({method: "eth_requestAccounts"});
        console.log('Connected to Theta Network');
        setIsConnected(true);
        let account = await window.ethereum.request({ method: "eth_accounts"});
        setAddress(account[0]);
        getUsername(account[0]);
        console.log(address);
        await handleNetworkSwitch("thetatestnet");
      } catch (error) {
        console.log('Error connecting to Theta Network');
      }
    } else {
      console.log('Metamask not detected');
    }
  }
  const disconnectMetamask = async () => {
    if (window.ethereum) {
      try {
        await window.ethereum.request({ method: "eth_requestAccounts" });
        console.log('Disconnected from Theta Network');
        setIsConnected(false);
        setAddress('');
        setUsername('');
      } catch (error) {
        console.log('Error disconnecting from Theta Network');
      }
    } else {
      console.log('No Metamask detected');
    }
  }

  const getUsername = async (walletAddress) => {
    try {
      const response = await fetch(`/api/user/getUser?walletAddress=${walletAddress}`);
      const data = await response.json();
      if (data.user) {
        setUsername(data.user.username);
      }
    } catch (err) {
      console.error('Error retrieving username:', err);
    }
  };

  const switchNetwork = async () => {
    try {
      await ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{
          chainId: `0x${Number(365).toString(16)}`,
          chainName: "Theta Testnet",
          nativeCurrency: {
            name: "TFUEL",
            symbol: "TFUEL",
            decimals: 18
          },
          rpcUrls: ["https://eth-rpc-api-testnet.thetatoken.org/rpc"],
          blockExplorerUrls: ["https://testnet-explorer.thetatoken.org/"]
        }],
      });
    } catch (addError) {
      console.log(addError);
    }
  }

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
    if (clientWindowHeight > 5) {
      let boxShadowVar = 0.03;
      setBoxShadow(boxShadowVar);
    } else {
      let boxShadowVar = 0;
      setBoxShadow(boxShadowVar);
    }
  }, [clientWindowHeight]);


  return (
    <nav className={`${styles.nav} ${isFixed ? styles.navFixed : styles.navRelative}`} style={{boxShadow: `0px 4px 15px rgb(0 0 0 / ${boxShadow})`,}}>
      <div className={styles.navbarContainer + ' container'}>
        <div className={styles.content}>
          <div className={styles.logo}>
            <Link href="/" className={styles.logoImg}>
              <Image
                src="/img/Thetatix-b.svg"
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
                <Link href="/mytickets" className={styles.navLink}>
                  My tickets
                </Link>
              </li>
              <li>
                <Link href="/events" className={styles.navLink}>
                  Events
                </Link>
              </li>
              <li>
                <Link href="/create" className={styles.navLink}>
                  Create an event
                </Link>
              </li>
              {/* <li>
                <button onClick={() => handleNetworkSwitch("theta")}>Theta</button>
              </li> */}
            </ul>
            <SearchBar />

          </div>
          <div className={styles.right}>
            <div className={styles.themeBtn}>
              <button onClick={toggleTheme}>
                <Image
                  src={"/icons/" + (theme === 'dark' ? 'light' : 'dark') + "-theme.svg"}
                  alt="Theme icon"
                  width={32}
                  height={32}
                  priority
                />
              </button>
            </div>
          {isConnected ? (
            <div className={styles.connectBtn}>
              <button>
                {username ? (username) : (formatAddress(address))}
                <Image
                  src="/icons/chevron.svg"
                  alt="Chevron icon"
                  width={40}
                  height={40}
                />
              </button>
              <div className={styles.dropdown}>
              <Link href="/profile" className={styles.dropdownLink}>
                  <Image
                    src="/icons/account.svg"
                    alt="Account icon"
                    width={40}
                    height={40}
                  />
                  Profile
                </Link>
                <br />
                <Link href="/dashboard" className={styles.dropdownLink}>
                  <Image
                    src="/icons/account.svg"
                    alt="Account icon"
                    width={40}
                    height={40}
                  />
                  My created events
                </Link>
                <br />
                <Link href="#" onClick={disconnectMetamask} className={styles.dropdownLink}>
                  <Image
                    src="/icons/logout.svg"
                    alt="Logout icon"
                    width={40}
                    height={40}
                  />
                  Disconnect
                </Link>
              </div>
            </div>
          ) : (
            <div className={styles.connectBtn}>
              <button onClick={connectMetamask}>Connect wallet</button>
            </div>
          )}
          {/* <button className={styles.posBtn} onClick={handleNavbarPositionChange}>
            x
          </button> */}
          </div>
        </div>
      </div>
    </nav>
  )
}
