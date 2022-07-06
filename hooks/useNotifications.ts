import { useContext } from "react";
import useSWR from "swr"
import { WalletContext } from "../contexts/WalletContext";
import { fetchWithAuth } from "../lib/swrFetchers"

export const useNotifications =  (showNotifications) => {
    const { address } = useContext(WalletContext);

    const { data, error } = useSWR(
        address && showNotifications ? [`/api/notifications`, address] : null,
        fetchWithAuth,
        {
            dedupingInterval: 2000,
            // refreshInterval: 10000, // IF we use this, then probably set it to the same as the dedupinterval. We will likely poll on something much smaller if we need to. i.e. 'are there new notifications'
            // revalidateOnReconnect: true,
            revalidateOnMount: true,
            // revalidateIfStale: true
        })
  
    return {
      notifications: data,
      isLoading: !error && !data,
      isError: error
    }
  }