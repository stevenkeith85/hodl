import { NextApiRequest, NextApiResponse } from "next";
import apiRoute from "../handler";
import Pusher from "pusher";
import { getUser } from "../user/[handle]";
import { HodlNextApiRequest } from "../../../models/HodlNextApiRequest";
import { pusher } from "../../../lib/server/pusher";


// const pusher = new Pusher({
//   appId: process.env.PUSHER_APP_ID,
//   key: process.env.NEXT_PUBLIC_PUSHER_APP_KEY,
//   secret: process.env.PUSHER_APP_SECRET,
//   cluster: process.env.NEXT_PUBLIC_PUSHER_APP_CLUSTER,
//   useTLS: true,
//   encryptionMasterKeyBase64: process.env.PUSHER_ENCRYPTION_KEY,
// });

const route = apiRoute();


route.post(async (req: HodlNextApiRequest, res: NextApiResponse) => {  
    console.log("PUSHER ENDPOINT CALLED")
  if (!req.address) {
    return res.status(403).json({ message: "Not authenticated" });
  }

  const socketId = req.body.socket_id;

  const hodlUser = await getUser(req.address, null)
  
//   // Replace this with code to retrieve the actual user id and info
  const user = {
    id: hodlUser.address,
    user_info: {
      name: hodlUser.nickname || hodlUser.address,
    }
  };
  const authResponse = pusher.authenticateUser(socketId, user);
  res.send(authResponse);

});


export default route;

export const config = {
    api: {
      bodyParser: true
    },
  };
  