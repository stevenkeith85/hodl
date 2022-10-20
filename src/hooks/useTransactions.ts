import useSWRInfinite from 'swr/infinite'
import axios from 'axios'

export const useTransactions = (limit = 10, processed=true, fallbackData = null, load=true) => {

    const getKey = (index, _previous) => {
        return load && limit ? [`/api/transactions/${processed ? 'processed': 'pending'}`, index * limit, limit] : null;
    }

    const swr = useSWRInfinite(
        getKey,
        (url, offset, limit) => axios.get(`${url}?offset=${offset}&limit=${limit}`).then(r => r.data),
        {
            fallbackData
        }
    );

    return {
        swr
    };
}
