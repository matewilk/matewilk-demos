import type { NextPage } from "next";

import Header from "@/components/layout/Header";
import { Chat } from "@/components/chat/Chat";

const Chats: NextPage = () => {
  return (
    <div className="flex min-h-screen flex-col">
      <Header signedIn={true} />
      <Chat />
    </div>
  );
};

export default Chats;
