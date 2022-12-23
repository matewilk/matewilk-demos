import { useState, useEffect } from "react";
import { gql, useSubscription, useMutation } from "@apollo/client";

export const useChat = ({ chatId }: { chatId: string }) => {
  const [messages, setMessages] = useState([]);

  const CHAT_SUBSCRIPTION = gql`
    subscription Subscription($chatId: String) {
      chat(id: $chatId) {
        text
      }
    }
  `;

  const subscription = useSubscription(CHAT_SUBSCRIPTION, {
    variables: { chatId },
  });
  const { data } = subscription;

  useEffect(() => {
    if (data) {
      setMessages((prev) => [
        ...prev,
        {
          id: messages.length.toString(),
          text: data.chat.text,
          sender: "other",
        },
      ]);
    }
  }, [data]);

  const SEND_MESSAGE = gql`
    mutation Mutation($chatId: String!, $text: String!) {
      sendMessage(chatId: $chatId, text: $text) {
        text
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
