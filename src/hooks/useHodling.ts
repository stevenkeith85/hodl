import useSWRInfinite from 'swr/infinite'
import { fetchWithAddressOffsetLimit } from '../lib/swrFetchers';

export const useHodling = (address, limit = 10, fallbackData = null, load=true) => {

    const getKey = (index, _previous) => {
        return load && limit ? [`/api/contracts/token/hodling`, address, index * limit, limit] : null;
    }

    const swr = useSWRInfinite(
        getKey,
        fetchWithAddressOffsetLimit,
        {
            dedupingInterval: 4000, // default is 2000. This is a little higher incase we have multiple hooks on the same page asking for the same thing. 10 seconds should be long enough for a page load.
            focusThrottleInterval: 10000, // default is 5000. this is how many seconds user needs to focussed in another window before we'd revalidate on focus
            fallbackData,
            shouldRetryOnError: false
        });
    return {
        swr
    };
}
