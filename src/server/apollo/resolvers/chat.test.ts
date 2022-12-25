import { PubSub } from "graphql-subscriptions";
import chatResolver from "./chat";

describe("chat resolver", () => {
  const contextMock = {
    pubSub: {
      asyncIterator: jest.fn(),
      publish: jest.fn(),
    } as unknown as PubSub,
  };
  describe("Subscription", () => {
    const { Subscription } = chatResolver;

    describe("chat", () => {
      it("should subscribe to chat by id", () => {
        const args = { id: "345" };

        Subscription.chat.subscribe(null, args, contextMock);

        expect(contextMock.pubSub.asyncIterator).toHaveBeenCalledWith(
          `CHAT_${args.id}`
        );
      });

      it("should resolve payload as expected", () => {
        const payload = {
          id: "1",
          text: "test message",
          userId: "1",
        };
        const result = Subscription.chat.resolve(payload);

        const expected = {
          id: "1",
          text: "test message",
          userId: "1",
        };
        expect(result).toEqual(expected);
      });
    });
  });

  describe("Mutation", () => {
    const { Mutation } = chatResolver;

    describe("sendMessage", () => {
      it("should publish and return message", async () => {
        const args = { chatId: "345", text: "test message", userId: "1" };

        const result = await Mutation.sendMessage(null, args, contextMock);

        expect(contextMock.pubSub.publish).toHaveBeenCalledWith(`CHAT_345`, {
          text: "test message",
          userId: "1",
        });
        expect(result).toEqual({ text: "test message", userId: "1" });
      });
    });
  });
});
