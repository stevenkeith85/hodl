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
    console.log('Error', error);
    res.status(500).json(error);
  }
}).use((req, res, next) => {
  const {authorization} = req.headers;
  console.log('Authorization', authorization)

  if (!authorization) {
    next();
  } else {
    
    const { address } = jwt.verify(authorization, process.env.JWT_SECRET);
    req.address = address;
    next();
  }

  

});

export default handler;