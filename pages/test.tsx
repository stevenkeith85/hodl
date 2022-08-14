import { Box } from "@mui/material"
import Head from "next/head"
import { useEffect, useRef } from "react"
import Pusher from 'pusher-js';
import { HodlAction } from "../models/HodlAction";
import { enqueueSnackbar } from "notistack";


export default function Test() {
    const effectCalled = useRef(false)

    useEffect(() => {
        if (effectCalled.current) {
            return;
        }

        const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_APP_KEY, {
            cluster: process.env.NEXT_PUBLIC_PUSHER_APP_CLUSTER
        });

        const channel = pusher.subscribe('notifications');

        channel.bind('notification', (action: HodlAction) => {
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
    }, [])


    return (<>
        <Head>
            <title>Pusher Test</title>
        </Head>
        <Box>
            <h1>Pusher Test</h1>
            <p>
                Try publishing an event to channel <code>my-channel</code>
                with event name <code>my-event</code>.
            </p>

        </Box>

    </>)
}
