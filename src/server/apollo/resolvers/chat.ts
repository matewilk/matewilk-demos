import { PubSub } from "graphql-subscriptions";
import { v4 as uuidv4 } from "uuid";

type Payload = {
  id: string;
  text: string;
  userId: string;
};

export default {
  Subscription: {
    chat: {
      subscribe(
        _: any,
        { id }: { id: string },
        { pubSub }: { pubSub: PubSub }
      ): AsyncIterator<string> {
        return pubSub.asyncIterator(`CHAT_${id}`);
      },

      resolve: (payload: Payload) => {
        return {
          id: payload.id,
          text: payload.text,
          userId: payload.userId,
        };
      },
    },
  },

  Mutation: {
    sendMessage: async (
      _: any,
      {
        chatId,
        text,
        userId,
      }: { chatId: string; text: string; userId: string },
      { pubSub }: { pubSub: PubSub }
    ) => {
      const id = uuidv4();
      await pubSub.publish(`CHAT_${chatId}`, { id, text, userId });

      return {
        id,
        text,
        userId,
      };
    },
  },

  Query: {
    chatHistory: async (
      _: any,
      { chatId }: { chatId: string }
    ): Promise<Payload[]> => {
      return Promise.resolve([
        {
          id: "1",
          text: "Hello",
          userId: "1",
        },
        {
          id: "2",
          text: "World",
          userId: "2",
        },
      ]);
    },
  },
};
