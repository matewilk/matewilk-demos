import type { GetServerSidePropsContext, NextPage } from "next";
import { ApolloProvider, gql } from "@apollo/client";
import { useSession } from "next-auth/react";
import { useIsMounted } from "@/hooks/useIsMounted";

import { apolloClient } from "@/hooks/useWebSocketClient";
import Header from "@/components/layout/Header";
import PleaseSignIn from "@/components/layout/SignIn";
import { Chat } from "@/components/chat/Chat";
import { type Message } from "@/components/chat/Chat";

type Query = {
  id: string;
};

interface ChatPageProps {
  query: Query;
  history: Message[];
}

const ChatPage: NextPage<ChatPageProps> = ({ query, history }) => {
  const isMounted = useIsMounted();
  const { id } = query;
  const { data: session } = useSession();

  return isMounted ? (
    <ApolloProvider client={apolloClient()}>
      <div className="flex min-h-screen flex-col bg-gradient-to-t from-blue-700 to-[#2e026d] font-thin">
        <Header />
        {session ? <Chat chatId={id} history={history} /> : null}
        {!session ? <PleaseSignIn /> : null}
      </div>
    </ApolloProvider>
  ) : null;
};

export default ChatPage;

import { getServerAuthSession } from "@/server/common/get-server-auth-session";

const CHAT_HISTORY = gql`
  query GetChatHistory($chatId: String!) {
    chatHistory(chatId: $chatId) {
      id
      text
      userId
    }
  }
`;

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
