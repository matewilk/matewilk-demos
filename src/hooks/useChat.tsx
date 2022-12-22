import { useState, useEffect } from "react";
import { gql, useSubscription, useMutation } from "@apollo/client";

export const useChat = ({ chatId }: { chatId: string }) => {
  const [messages, setMessages] = useState([
    { id: "0", text: "Hello", sender: "user" },
    { id: "1", text: "Hi", sender: "other" },
  ]);

  const CHAT_SUBSCRIPTION = gql`
    subscription Subscription($chatId: String) {
      chat(id: $chatId) {
        message
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
          text: data.chat.message,
          sender: "other",
        },
      ]);
    }
  }, [data]);

  const SEND_MESSAGE = gql`
    mutation Mutation($chatId: String!, $message: String!) {
      sendMessage(chatId: $chatId, message: $message) {
        message
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
