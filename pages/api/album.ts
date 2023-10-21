import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import { customGet } from "../../utils/customGet";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const albumId = req.body.albumId;
  const session = await getSession({ req });

  const albumResults = await customGet(
    `https://api.spotify.com/v1/albums/${albumId}`,
        session
  );
  res.status(200).json(albumResults);
}