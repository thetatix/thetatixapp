import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import useContracts from "@/components/contractsHook/useContract";
import { DataContext } from "@/context/DataContext";
import { ethers } from "ethers";

export default function OnlineEventStream() {
    const [userHaveTicket, setUserHaveTicket] = useState(false);
    const [eventData, setEventData] = useState({});
    const { address, setAddress } = useContext(DataContext);

    //eventAddress url
    const router = useRouter();
    const { eventAddress } = router.query;

    async function initialSetup() {
        //get the stream_playback_url
        const data_event = await fetch(`/api/event/getStreamUrl?eventContractAddress=${eventAddress}`)
        setEventData(data_event);
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
        console.log('address', address)
        if (address) {
            checkUserHaveTicket();
        }
    }, [address])

    //get data
    useEffect(() => {
        if (userHaveTicket) {
            initialSetup();
        }
    }, [eventAddress, userHaveTicket])

    return (<div style={{ paddingTop: "10rem" }}>
        {address
            ?
            <>
                {
                    userHaveTicket
                        ?
                        <div>
                            watching the stream
                        </div>
                        :
                        <div>
                            you dont have not bought a tikcet for watch the event, please buy one, but 1 ticket btn
                        </div>
                }
            </>

            :
            <>please connect wallet first</>
        }
    </div>

    )
}