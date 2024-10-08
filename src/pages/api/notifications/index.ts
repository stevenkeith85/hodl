import { NextApiResponse } from "next";

import apiRoute from '../handler';

import { Redis } from '@upstash/redis';

const client = Redis.fromEnv()
const route = apiRoute();

// We compare the timestamp of the latest notifications with the stored timestamp in the user hash.
//
// The 'notifications read at' timestamp will be updated when the user gets the lastest notifications i.e. opens the notifications menu.

export const checkForNewNotifications = async (address) => {
  const lastRead: string = await client.get(`user:${address}:notifications:lastRead`);
  
  const [notification, timestamp] = await client.zrange(`user:${address}:notifications`, 0, 0, { rev: true, withScores: true });

  // check if last notification time is newer than user's last read time
  if (timestamp) {
    return +timestamp > +lastRead;
  }
  
  // no notifications
  return false;
}


route.get(async (req, res: NextApiResponse) => {
  if (!req.address) {
    return res.status(403).json({ message: "Not authenticated" });
  }

  const unread = await checkForNewNotifications(req.address);
  res.status(200).json({unread})
});

export default route;
