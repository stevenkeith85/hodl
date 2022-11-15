import { NextApiResponse } from "next";
import apiRoute from "../handler";
import { HodlNextApiRequest } from "../../../models/HodlNextApiRequest";
import { pusher } from "../../../lib/server/pusher";
import { getUser } from "../../../lib/database/rest/getUser";


const route = apiRoute();


route.post(async (req: HodlNextApiRequest, res: NextApiResponse) => {  
    console.log("PUSHER ENDPOINT CALLED")
  if (!req.address) {
    return res.status(403).json({ message: "Not authenticated" });
  }

  const socketId = req.body.socket_id;

  const hodlUser = await getUser(req.address, null)
  
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
  