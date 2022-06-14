import { Redis } from '@upstash/redis';
import dotenv from 'dotenv'
import apiRoute from "../../handler";
import memoize from 'memoizee';
import { ethers } from "ethers";
import { nftaddress } from "../../../../config";
import { getProvider } from "../../../../lib/server/connections";
import HodlNFT from '../../../../artifacts/contracts/HodlNFT.sol/HodlNFT.json';
import { CommentCountValidationSchema } from '../../../../validationSchema/comments/commentCount';

dotenv.config({ path: '../.env' })

const client = Redis.fromEnv()
const route = apiRoute();

export const getCommentCount = memoize(async (object, id) => {
  const count = await client.zcard(`comments:${object}:${id}`);
  return count;
}, {
  primitive: true,
  max: 10000, // 10000 tokens 
});


route.get(async (req, res) => {
  const object = Array.isArray(req.query.object) ? req.query.object[0] : req.query.object;
  const id = Array.isArray(req.query.id) ? req.query.id[0] : req.query.id;

  const isValid = await CommentCountValidationSchema.isValid(req.query)
  if (!isValid) {
    return res.status(400).json({ message: 'Bad Request - yup' });
  }

  if (object === "token") {
    const provider = await getProvider();
    const contract = new ethers.Contract(nftaddress, HodlNFT.abi, provider);
    const tokenExists = await contract.exists(id);

    if (!tokenExists) {
      return res.status(400).json({ message: 'Bad Request' });
    }
  }


  const count = await getCommentCount(object, id);
  res.status(200).json(count);
});


export default route;
