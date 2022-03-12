// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import nextConnect from 'next-connect'
import * as Redis from 'ioredis';
import dotenv from 'dotenv'

dotenv.config({ path: '../.env' })

const apiRoute = nextConnect({
  onNoMatch(req, res) {
    res.status(405).json({ error: `Method '${req.method}' Not Allowed` });
  },
});

let client = new Redis(process.env.REDIS_CONNECTION_STRING);


apiRoute.get(async (req, res) => {
  const { tokenId } = req.query;

  const tokenJson = await client.get(tokenId);
  const token  = JSON.parse(tokenJson);
  
  res.status(200).json({ ...token });
});


export default apiRoute;
