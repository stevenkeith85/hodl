import { NextApiResponse } from "next";

import apiRoute from '../handler';

import { getCommentVM } from "../../../lib/database/rest/getCommentVM";

const route = apiRoute();

// TODO: If we migrate the jwt auth to jose, we could convert this to an edge function
route.get(async (req, res: NextApiResponse) => {
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ message: 'Bad Request' });
  }

  const comment = await getCommentVM(id, req?.address);

  res.status(200).json(comment)
});

export default route;
