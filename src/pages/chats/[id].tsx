import { useRouter } from "next/router";
import type { NextPage } from "next";
import { ApolloProvider, gql } from "@apollo/client";

import { apolloClient } from "@/helpers/webSocketClient";
import Header from "@/components/layout/Header";
import { Chat } from "@/components/chat/Chat";

type Query = {
  id: string;
};

interface ChatPageProps {
  query: Query;
  history: { message: string }[];
}

const CHAT_HISTORY = gql`
  query GetChatHistory($chatId: String!) {
    chatHistory(chatId: $chatId) {
      id
      text
      userId
    }
  }
`;

const ChatPage: NextPage<ChatPageProps> = ({ query, history }) => {
  const { id } = query;
  const { isReady } = useRouter();

  return isReady ? (
    <ApolloProvider client={apolloClient()}>
      <div className="flex min-h-screen flex-col">
        <Header signedIn={true} />
        <Chat chatId={id} history={history} />
      </div>
    </ApolloProvider>
  ) : null;
};

export default ChatPage;

export const getServerSideProps = async ({ query }: { query: Query }) => {
  const { id } = query;
  const { data } = await apolloClient().query({
    query: CHAT_HISTORY,
    variables: {
      chatId: id,
    },
  });
  const { chatHistory: history } = data;

  return {
    props: { query, history },
  };
};
