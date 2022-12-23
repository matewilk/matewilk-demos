import { PubSub } from "graphql-subscriptions";

type Payload = {
  id: string;
  text: string;
  sender: {
    id: string;
    name: string;
  };
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
        return payload;
      },
    },
  },

  Mutation: {
    sendMessage: async (
      _: any,
      { chatId, text }: { chatId: string; text: string },
      { pubSub }: { pubSub: PubSub }
    ) => {
      await pubSub.publish(`CHAT_${chatId}`, { text });

      return {
        text,
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
          sender: {
            id: "1",
            name: "John",
          },
        },
        {
          id: "2",
          text: "World",
          sender: {
            id: "2",
            name: "Jane",
          },
        },
      ]);
    },
  },
};
