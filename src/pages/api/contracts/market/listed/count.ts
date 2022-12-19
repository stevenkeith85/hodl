import apiRoute from "../../../handler";
import { get } from "../../../../../lib/database/rest/get";


const route = apiRoute();

export const getListedCount = async (address, skipCache = false): Promise<number> => {
  if (!address) {
    return null;
  }

  let listedCount = await get(`user:${address}:listedCount`);

  if (listedCount === null) {
    // This won't really happen, but we've handled it in 'index'
    return 0;
  }

  return listedCount;
}

// Requests the number of accounts address follows
route.get(async (req, res) => {
  const { address } = req.query;

  if (!address) {
    return res.status(400).json({ message: 'Bad Request' });
  }

  const count = await getListedCount(address);
  res.status(200).json(count);
});


export default route;
