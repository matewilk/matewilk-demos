import { useState } from "react";
import { gql, SubscriptionOptions, useMutation } from "@apollo/client";
import { useSubscription } from "@/hooks/useSubscription";

export const useChat = ({ chatId }: { chatId: string }) => {
  const [messages, setMessages] = useState([
    { id: "1", text: "Hello", sender: "user" },
    { id: "2", text: "Hi", sender: "other" },
  ]);

  const CHAT_SUBSCRIPTION = gql`
    subscription Subscription($chatId: String) {
      chat(id: $chatId) {
        message
      }
    }
  `;

  const chatSubscription: SubscriptionOptions = {
    query: CHAT_SUBSCRIPTION,
    variables: { chatId },
  };

  const observer = {
    next({ data }: { data: any }) {
      const message = data.chat.message;
      setMessages((messages) => [
        ...messages,
        { text: message, id: (messages.length + 1).toString(), sender: "user" },
      ]);
    },
  };

  useSubscription(chatSubscription, observer);

  const SEND_MESSAGE = gql`
    mutation Mutation($chatId: String!, $message: String!) {
      sendMessage(chatId: $chatId, message: $message) {
        message
      }
    }
  `;

  return {
    messages,
    sendMessageMutation: useMutation(SEND_MESSAGE),
    observer,
  };
};
