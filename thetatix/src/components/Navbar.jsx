
'use client';

import { useContext, useEffect, useState } from "react";
import { DataContext } from "@/context/DataContext";
import Image from 'next/image'
import Link from 'next/link'
import styles from '@/assets/styles/Navbar.module.css'


export default function Navbar() {

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



  
  const { address, setAddress, isConnected, setIsConnected } =  useContext(DataContext);

  const connectMetamask = async () => {
    if (window.ethereum) {
      try {
        await window.ethereum.request({method: "eth_requestAccounts"});
        console.log('Connected to Ethereum');
        setIsConnected(true);
        let account = await window.ethereum.request({ method: "eth_accounts"});
        setAddress(account[0]);
        console.log(address);
        await handleNetworkSwitch("thetatestnet");
      } catch (error) {
        console.log('Error connecting to Ethereum');
      }
    } else {
      console.log('Metamask not detected');
    }
  }
  const disconnectMetamask = async () => {
    if (window.ethereum) {
      try {
        await window.ethereum.request({ method: "eth_requestAccounts" });
        console.log('Disconnected from Ethereum');
        setIsConnected(false);
        setAddress('');
      } catch (error) {
        console.log('Error disconnecting from Ethereum');
      }
    } else {
      console.log('No Metamask detected');
    }
  }
  const formatAddress = (address) => {
    if (address.length === 42) {
      return address.substring(0, 6) + "..." + address.substring(38);
    } else {
      return address;
    }
  }

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

  const submitForm = async (e) => {
    // e.preventDefault();
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
            <div className={styles.searchBar}>
              <form action="" onSubmit={submitForm} method="POST" className={styles.searchInput + ' input-group'}>
                <input type="search" className={styles.input + ' form-control'} placeholder="Search for an event" aria-describedby="searchBtn" />
                <button id="searchBtn" type="submit">
                  <Image
                    src="/icons/search.svg"
                    alt="Search icon"
                    width={40}
                    height={40}
                  />
                </button>
              </form>
            </div>
          </div>
          <div className={styles.right}>
          {isConnected ? (
            <div className={styles.connectBtn}>
              <button>
                {formatAddress(address)}
                <Image
                  src="/icons/chevron.svg"
                  alt="Chevron icon"
                  width={40}
                  height={40}
                />
              </button>
              <div className={styles.dropdown}>
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
          </div>
        </div>
      </div>
    </nav>
  )
}
