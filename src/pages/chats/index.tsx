import type { NextPage, GetServerSideProps } from "next";
import Link from "next/link";

import { ApolloProvider } from "@apollo/client";
import { apolloClient } from "@/hooks/useWebSocketClient";

import Header from "@/components/layout/Header";
import { Chat } from "@/components/chat/Chat";

type Chat = {
  id: string;
  name: string;
};

interface ChatsProps {
  chats: Chat[];
}

const ChatsList = ({ chats }: { chats: Chat[] }) => {
  return (
    <section
      id="chat"
      aria-label="chat"
      className="h-1 flex-grow bg-black/10 font-thin text-slate-300"
    >
      <div className="mx-auto h-full max-w-3xl py-10">
        <div className="frosted flex h-full overflow-auto rounded-xl">
          <ul className="flex w-full flex-col gap-2 py-5 px-5">
            {chats.map((chat) => (
              <Link
                className="w-full bg-green-50"
                href={`/chats/${chat.id}`}
                key={chat.id}
              >
                <li className="frosted w-full cursor-pointer rounded-md p-5 duration-500 hover:bg-white/10">
                  {chat.name}
                </li>
              </Link>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};

const Chats: NextPage<ChatsProps> = ({ chats }: { chats: Chat[] }) => {
  return (
    <ApolloProvider client={apolloClient()}>
      <div className="flex min-h-screen flex-col bg-gradient-to-t from-blue-400 to-[#2e026d]">
        <Header />
        <ChatsList chats={chats} />
      </div>
    </ApolloProvider>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  const chants = await fetch("http://localhost:3000/api/chats");
  const chats = await chants.json();
  return {
    props: {
      chats,
    },
  };
};

export default Chats;
