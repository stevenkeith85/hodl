// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { NextApiRequest, NextApiResponse } from "next";

import nc from 'next-connect'
import dotenv from 'dotenv'
import jwt from 'jsonwebtoken'

dotenv.config({ path: '../.env' })

export interface HodlApiRequest extends NextApiRequest {
  address: string | null
}

const handler =  () => nc<HodlApiRequest, NextApiResponse>({
  onNoMatch(req: NextApiRequest, res: NextApiResponse) {
    res.status(405).json({ error: `Method '${req.method}' Not Allowed` });
  },
  onError(error, req, res) {
    // TODO: Write this error somewhere. Perhaps REDIS
    console.log('API Route Error', 'address: ', req.address, 'path: ', req.url, 'message: ', error.message)
    res.status(500).json(error);
  }
}).use((req, res, next) => {
    const {authorization} = req.headers;
    if (!authorization) {
      next();
    } else {  
      try {
        const { address } = jwt.verify(authorization, process.env.JWT_SECRET);
        req.address = address;
        next();
      } catch (e) {
        if (e instanceof jwt.TokenExpiredError) {
          // Return a 403; so that the FE re-requests a login
          return res.status(403).json({message: 'jwt has expired'})
        } else {
          return res.status(500).json({message: 'something has gone wrong'})
        }
      }
      
  }
});

export default handler;