import { useState, useEffect } from "react";
import { gql, useSubscription, useMutation } from "@apollo/client";

export const useChat = ({ chatId }: { chatId: string }) => {
  const [messages, setMessages] = useState([] as any[]);

  const CHAT_SUBSCRIPTION = gql`
    subscription Subscription($chatId: String) {
      chat(id: $chatId) {
        id
        text
        userId
        userName
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
          userName: data.chat.userName,
        },
      ]);
    }
  }, [data]);

  const SEND_MESSAGE = gql`
    mutation Mutation(
      $text: String!
      $chatId: String!
      $userId: String!
      $userName: String!
    ) {
      sendMessage(
        text: $text
        chatId: $chatId
        userId: $userId
        userName: $userName
      ) {
        id
        text
        userId
        userName
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
