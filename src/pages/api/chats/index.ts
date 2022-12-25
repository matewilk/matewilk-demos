import { NextApiRequest, NextApiResponse } from "next";

const getChats = async () => {
  const chats = [
    {
      id: 1,
      name: "Chat 1",
    },
    {
      id: 2,
      name: "Chat 2",
    },
    {
      id: 3,
      name: "Chat 3",
    },
  ];
  return Promise.resolve(chats);
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const chats = await getChats();
  res.status(200).json(chats);
}
