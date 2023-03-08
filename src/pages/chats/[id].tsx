import { useRouter } from "next/router";
import type { GetServerSidePropsContext, NextPage } from "next";
import { ApolloProvider, gql } from "@apollo/client";

import { apolloClient } from "@/hooks/useWebSocketClient";
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
        <Header />
        <Chat chatId={id} history={history} />
      </div>
    </ApolloProvider>
  ) : null;
};

export default ChatPage;

import { getServerAuthSession } from "@/server/common/get-server-auth-session";

export const getServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const session = await getServerAuthSession(context);

  const { query } = context;
  const { id } = query;
  const { data } = await apolloClient().query({
    query: CHAT_HISTORY,
    variables: {
      chatId: id,
    },
  });
  const { chatHistory: history } = data;

  return {
    props: { query, history, session },
  };
};
