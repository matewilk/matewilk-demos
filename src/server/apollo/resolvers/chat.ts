import { RedisPubSub } from "graphql-redis-subscriptions";
import { v4 as uuidv4 } from "uuid";

type Payload = {
  id: string;
  text: string;
  userId: string;
  userName: string;
};

export default {
  Subscription: {
    chat: {
      subscribe(
        _: any,
        { id }: { id: string },
        { pubSub }: { pubSub: RedisPubSub }
      ): AsyncIterator<string> {
        return pubSub.asyncIterator(`CHAT_${id}`);
      },

      resolve: (payload: Payload) => {
        return {
          id: payload.id,
          text: payload.text,
          userId: payload.userId,
          userName: payload.userName,
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
        userName,
      }: { chatId: string; text: string; userId: string; userName: string },
      { pubSub }: { pubSub: RedisPubSub }
    ) => {
      const id = uuidv4();
      await pubSub.publish(`CHAT_${chatId}`, { id, text, userId, userName });

      return {
        id,
        text,
        userId,
        userName,
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
          userName: "John",
        },
        {
          id: "2",
          text: "World",
          userId: "2",
          userName: "Jane",
        },
      ]);
    },
  },
};
