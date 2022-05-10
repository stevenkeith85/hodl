import axios from 'axios'

export const fetchWithAuth = url => axios.get(
    url,
    {
        headers: {
            'Accept': 'application/json',
            'Authorization': localStorage.getItem('jwt')
        }
    }).then(r => r.data);

export const fetchWithAddress = (url, address) => axios.get(url, { params: { address } }).then(r => r.data);
export const fetchWithAddressOffsetLimit = (url, address, offset, limit) => axios.get(url, { params: { address, offset, limit } }).then(r => r.data);
export const fetchWithOffsetLimit = (url, offset, limit) => axios.get(url, { params: { offset, limit } }).then(r => r.data);