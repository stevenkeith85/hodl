import axios from 'axios'

export const fetchWithAuth = url => axios.get(
    url,
    {
        headers: {
            'Accept': 'application/json',
            'Authorization': localStorage.getItem('jwt')
        }
    }).then(r => r.data);

export const fetchWithId = (url, id) => axios.get(url, { params: { id } }).then(r => r.data);
export const fetchWithIdOffsetLimit = (url, id, offset, limit) => axios.get(url, { params: { id, offset, limit } }).then(r => r.data);

export const fetchWithAddress = (url, address) => axios.get(url, { params: { address } }).then(r => r.data);
export const fetchWithAddressOffsetLimit = (url, address, offset, limit) => axios.get(url, { params: { address, offset, limit } }).then(r => r.data);

export const fetchWithQueryOffsetLimit = (url, q, offset, limit) => axios.get(url, { params: { q, offset, limit } }).then(r => r.data);

export const fetchWithToken = (url, token) => axios.get(url, { params: { token } }).then(r => r.data);
export const fetchWithTokenOffsetLimit = (url, token, offset, limit) => axios.get(url, { params: { token, offset, limit } }).then(r => r.data);

export const fetchWithOffsetLimit = (url, offset, limit) => axios.get(url, { params: { offset, limit } }).then(r => r.data);