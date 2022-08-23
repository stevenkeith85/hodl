import http from "http";
import axios from 'axios';

export const instance = axios.create({
    httpAgent: new http.Agent({ keepAlive: true }),
});