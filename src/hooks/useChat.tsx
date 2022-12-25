import { useState, useEffect } from "react";
import { gql, useSubscription, useMutation } from "@apollo/client";

export const useChat = ({ chatId }: { chatId: string }) => {
  const [messages, setMessages] = useState([] as any[]);

  const CHAT_SUBSCRIPTION = gql`
    subscription Subscription($chatId: String) {
      chat(id: $chatId) {
        text
        userId
      }
    }
  `;

  // TODO: handle subscription errors
  // https://www.apollographql.com/docs/react/data/subscriptions/#handling-errors
  // also usefull when deving the subscription and schema changes
  const subscription = useSubscription(CHAT_SUBSCRIPTION, {
    variables: { chatId },
  });
  const { data } = subscription;

  useEffect(() => {
    if (data) {
      setMessages((prev) => [
        ...prev,
        {
          id: data.chat.id,
          text: data.chat.text,
          userId: data.chat.userId,
        },
      ]);
    }
  }, [data]);

  const SEND_MESSAGE = gql`
    mutation Mutation($chatId: String!, $text: String!, $userId: String!) {
      sendMessage(chatId: $chatId, text: $text, userId: $userId) {
        text
        userId
      }
    }
  `;

  const mutation = useMutation(SEND_MESSAGE);

  return {
    messages,
    subscription,
    mutation,
  };
};
