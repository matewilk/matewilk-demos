import type { NextPage } from "next";

import { ApolloProvider } from "@apollo/client";
import { apolloClient } from "@/helpers/webSocketClient";

import Header from "@/components/layout/Header";
import { Chat } from "@/components/chat/Chat";

const Chats: NextPage = () => {
  return (
    <ApolloProvider client={apolloClient()}>
      <div className="flex min-h-screen flex-col">
        <Header signedIn={true} />
        <Chat />
      </div>
    </ApolloProvider>
  );
};

export default Chats;
