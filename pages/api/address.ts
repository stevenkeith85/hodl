// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { NextApiRequest, NextApiResponse } from "next";
import nextConnect from 'next-connect'
import * as Redis from 'ioredis';
import dotenv from 'dotenv'
import { trim } from "../../lib/utils";
import memoize from 'memoizee';
import apiRoute from "./handler";

dotenv.config({ path: '../.env' })

const route = apiRoute();

// const apiRoute = nextConnect({
//   onNoMatch(req: NextApiRequest, res: NextApiResponse) {
//     res.status(405).json({ error: `Method '${req.method}' Not Allowed` });
//   },
// });

// export this, as we clear the memo when a new nickname is set
export const getAddress = memoize(async (nickname) => {
  try {
    const client = new Redis(process.env.REDIS_CONNECTION_STRING);
    console.log("CALLING REDIS FOR ADDRESS FOR NICKNAME", nickname);
    const address = await client.get(`address:${nickname}`); // O(1)
    await client.quit();
    return address;
  } catch (e) {
    console.log(e)
  }
}, { primitive: true, maxAge: 1000 * 60 * 60, max: 10000, async: true}); // cache for an hour and a maximum of 10000 items

// GET /api/address?nickname=steve
route.get(async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { nickname } = req.query;
    const sanitizedNickName = trim(nickname).toLowerCase();
    const address = await getAddress(sanitizedNickName);
    return res.status(200).json({address})
  } catch (e) {
    console.log(e)
  }
});


export default route;
