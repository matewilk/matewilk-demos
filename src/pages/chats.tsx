import type { NextPage } from "next";

import Header from "@/components/layout/Header";
import { ChatWindow } from "@/components/chat/ChatWindow";

const Chats: NextPage = () => {
  return (
    <div className="flex min-h-screen flex-col">
      <Header signedIn={true} />
      <ChatWindow />
    </div>
  );
};

export default Chats;
