import { useChat } from "@/hooks/useChat";
import { MessageForm } from "./MessageForm";

type Message = {
  id: string;
  text: string;
  sender: string;
};

const Message = ({ id, sender, text }: Message) => {
  return (
    <li
      key={id}
      className={`rounded-xl px-3 py-2 shadow ${
        sender === "user"
          ? "place-self-end rounded-tr-none bg-green-100 text-right"
          : "place-self-start rounded-tl-none bg-blue-100 text-left"
      }`}
    >
      {text}
    </li>
  );
};

const MessageList = ({ messages }: { messages: Message[] }) => {
  return (
    <ul className="grid grid-cols-1 space-y-5">
      {messages.map((message: Message) => (
        <Message key={message.id} {...message} />
      ))}
    </ul>
  );
};

export const Chat = () => {
  const chatId = "1";
  const { messages } = useChat({ chatId });

  return (
    // h-1 defines hegith of parent element
    // and makes child (whith h-full) grow to fill height
    <section id="chat" aria-label="chat" className="h-1 flex-grow bg-blue-100">
      <div className="mx-auto h-full max-w-3xl pb-28 pt-10">
        {/* chat window - flex-col-reverse to always scroll to the bottom of container */}
        <div className="flex h-full flex-col-reverse overflow-auto rounded-xl bg-white p-10">
          <MessageList messages={messages} />
        </div>
        <MessageForm chatId={chatId} />
      </div>
    </section>
  );
};
