import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import dynamic from 'next/dynamic'
import { ethers } from "ethers";
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'

import { DataContext } from "@/context/DataContext";

import useContracts from "@/components/contractsHook/useContract";
import VideoPlayer from "@/components/VideoPlayerHLS";
import styles from '@/assets/styles/Pages.module.css'
import styleStream from '@/assets/styles/Stream.module.css'

const AblyChatComponent = dynamic(() => import('../../../components/AppChatComponent'), { ssr: false });

export default function OnlineEventStream() {
    const [userHaveTicket, setUserHaveTicket] = useState(false);
    const [eventData, setEventData] = useState({});
    const [categoryData, setCategoryData] = useState({});
    const [loading, setLoading] = useState(true);
    const { address, isConnected, formatDescription, formatDateTime } = useContext(DataContext);
    const [error,setError] = useState('');
    //eventAddress url
    const router = useRouter();
    const { eventAddress } = router.query;

    async function initialSetup() {
        //get the stream_playback_url
        const data_event_json = await fetch(`/api/event/getStreamUrl?eventContractAddress=${eventAddress}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        })
        const {data:data_event} = await data_event_json.json();
        setEventData({ ...data_event });
        if (data_event_json.ok) {
            const data_category_json = await fetch(`/api/category/getCategory?categoryId=${data_event.category}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            })
            const data_category = await data_category_json.json();
            setCategoryData(data_category[0]);
            if (data_category_json.ok) {
                setLoading(false);
            }
        }
    }

    async function checkUserHaveTicket() {
        //DETERMINAR EL SIGNER DE METAMASK

        const provider = new ethers.providers.Web3Provider(window.ethereum, "any");

        // Metamask setup

        await provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();
        const contractsHook = new useContracts(signer);
        const userNftBalance = await contractsHook.checkUserOwnNftTicket(eventAddress, address);
        if (parseInt(userNftBalance._hex) > 0) {
            setUserHaveTicket(true);
        } else {
            setUserHaveTicket(false);
        }
    }

    //check user bought ticket
    useEffect(() => {
        setLoading(true);
        if (isConnected) {
            checkUserHaveTicket();
        }
    }, [eventAddress, address, isConnected])

    //get data
    useEffect(() => {
        if (userHaveTicket) {
            initialSetup();
        }
    }, [eventAddress, userHaveTicket])



    // const [streaming, setStreaming] = useState(true);
    // eventData.stream_playback_url?.length > 0
    // const [isOwner, setIsowner] = useState(false);
    // eventData.creator === address
    // useEffect(() => {
    //     setUserHaveTicket(true);
    //     initialSetup();
    // }, [eventAddress])

    return (
        <>
            <Head>
                <title>Event Stream</title>
                <meta name="description" content="Thetatix web app" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main className={styleStream.main}>
                <div className={styleStream.mainContainer}>
                    {isConnected ? <>
                        <div className={styleStream.event}>
                            <section className={styleStream.video}>
                                <div className={styleStream.videoContainer + ' container'}>
                                    <div className={styleStream.videoContent}>
                                        {((userHaveTicket) || (eventData.creator === address)) ? (
                                            (eventData.stream_playback_url?.length > 0) ? (
                                                <VideoPlayer src={eventData.stream_playback_url}/>
                                            ) : (
                                                <p>Stream has not started.</p>
                                            )
                                        ) : (
                                            <p>You do not have a ticket for this event.</p>
                                        )}
                                    </div>
                                </div>
                            </section>
                            <header className={styleStream.header}>
                                <div className={styleStream.headerContainer + ' container'}>
                                    <div className={styleStream.headerContent}>
                                        {loading ? (
                                            <p>Loading event...</p>
                                        ) : <>
                                            <form action="" className={styleStream.title}>
                                                <h1>
                                                    <Link href={'/event/' + eventData.contractAddress} target="_blank">
                                                        {eventData.eventName}
                                                        {/* <Image
                                                            src="/icons/external-link.svg"
                                                            alt="External link icon"
                                                            width={32}
                                                            height={32}
                                                        /> */}
                                                    </Link>
                                                </h1>
                                                {(eventData.creator === address) ? ((eventData.stream_playback_url?.length > 0) ? (
                                                        <button
                                                        className={styleStream.stopBtn}
                                                        >
                                                            Stop stream
                                                        </button>
                                                    ) : (
                                                        <button
                                                        className={styleStream.startBtn}
                                                        onClick={async()=>{
                                                            const data = await fetch(`/api/event/startStream?eventContractAddress=${eventAddress}`,{
                                                                method:'POST'
                                                            })
                                                            const parsed_data = await data.json();
                                                            console.log(parsed_data)
                                                        }}>
                                                            Start stream
                                                        </button>
                                                    )
                                                ) : (!userHaveTicket ? (
                                                        <Link href={'/event/' + eventData.contractAddress} className={styleStream.titleBuyTicket}>
                                                            Buy ticket
                                                        </Link>
                                                    ) : <Link href={'/category/' + eventData.category} target="_blank" className={styleStream.catLink}>{categoryData.categoryName}</Link>
                                                )}
                                            </form>
                                            <div className={styleStream.description}>
                                                <p>
                                                    {((eventData.creator === address) || (!userHaveTicket)) && <Link href={'/category/' + eventData.category} target="_blank" className={styleStream.catLink}>{categoryData.categoryName}</Link>}
                                                    {formatDescription(eventData.eventDescription)}
                                                </p>
                                            </div>
                                            <div className={styleStream.datetime}>
                                                <h2>Date and time</h2>
                                                <p>
                                                    Starts {formatDateTime(eventData.startDate)}
                                                    <br />
                                                    Ends {formatDateTime(eventData.endDate)}
                                                </p>
                                            </div>
                                        </>}
                                    </div>
                                </div>
                            </header>
                        </div>
                        <section className={styleStream.chat}>
                            <div className={styleStream.chatContainer + ' container'}>
                                <div className={styleStream.chatContent}>
                                    <div className={styleStream.chatHeader}>
                                        <h2>Live chat</h2>
                                    </div>
                                    {((userHaveTicket) || (eventData.creator === address)) && (
                                        (eventData.stream_playback_url?.length > 0) && (
                                            <AblyChatComponent eventAddress={eventAddress} />
                                        )
                                    )}
                                </div>
                            </div>
                        </section>
                    </> : <p className="ps-5">Wallet not connected.</p>}
                </div>
            </main>
        </>
    // <div>
    //     {/* check user wallet connected */}
    //     {isConnected ?
    //         <>
    //             {/* add this code to tickets managment after */}
    //             <div onClick={async()=>{
    //                 const data = await fetch(`/api/event/startStream?eventContractAddress=${eventAddress}`,{
    //                     method:'POST'
    //                 })
    //                 const parsed_data = await data.json();
    //                 console.log(parsed_data)
    //             }}>stream start</div>
    //             {
    //                 // check user bought ticket
    //                 userHaveTicket
    //                     ?
    //                     <>
    //                         {
    //                             //check streamer started the stream
    //                             eventData.stream_playback_url?.length > 0
    //                                 ?
    //                                 <div>
    //                                    <div>name: {eventData.eventName}</div> 
    //                                    <div>description: {eventData.eventDescription}</div>
    //                                    <div>ticcketsamount: {eventData.ticketsAmount}</div>
    //                                    <VideoPlayer src={eventData.stream_playback_url}/>
    //                                    <AblyChatComponent eventAddress={eventAddress} />
    //                                 </div>
    //                                 :
    //                                 <>event managers have to start the event yet</>
    //                         }
    //                     </>

    //                     :
    //                     <div>
    //                         you dont have not bought a tikcet for watch the event, please buy one, but 1 ticket btn
    //                     </div>
    //             }
    //         </>
    //         :
    //         <>please connect wallet first</>
    //     }
    // </div>

    )
}