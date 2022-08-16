import { NextApiRequest } from "next";

export interface HodlNextApiRequest extends NextApiRequest {
    address?: string;
}