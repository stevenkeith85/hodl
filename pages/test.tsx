import { Box } from "@mui/material"
import Head from "next/head"
import { useContext, useEffect, useRef } from "react"
import Pusher from 'pusher-js';
import { HodlAction } from "../models/HodlAction";
import { enqueueSnackbar } from "notistack";
import { WalletContext } from "../contexts/WalletContext";
import { authenticate } from "../lib/jwt";


export async function getServerSideProps({ req, res }) {
    await authenticate(req, res);
  
    return {
      props: {
        address: req.address || null,
      }
    }
  }

export default function Test({address}) {
    // const { address } = useContext(WalletContext);

    const effectCalled = useRef(false)

    useEffect(() => {
        if (!address) {
            return;
        }

        if (effectCalled.current) {
            return;
        }

        // This only needs done once. Perhaps do it in _app
        const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_APP_KEY, { 
            cluster: process.env.NEXT_PUBLIC_PUSHER_APP_CLUSTER,
            userAuthentication: { 
                endpoint: "/api/pusher/user-auth",
                transport: "ajax"
            }
        });

        pusher.signin();

        pusher.user.bind('notification-hover', (action: HodlAction) => {
            enqueueSnackbar(
                "",
                { 
                    variant: 'notification',
                    action,
                    persist: true
                }
            )
        });

        effectCalled.current = true;
    }, [address])


    return (<>
        <Head>
            <title>Test</title>
        </Head>
        <Box>
            <h1>Test</h1>
            <p>
                Test Bed
            </p>

        </Box>

    </>)
}
