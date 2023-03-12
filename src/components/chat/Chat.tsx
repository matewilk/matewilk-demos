import { useSession } from "next-auth/react";

import { useChat } from "@/hooks/useChat";
import { MessageForm } from "./MessageForm";

export type Message = {
  id: string;
  text: string;
  userId: string;
  userName: string;
};

const Message = ({ id, text, userId, userName }: Message) => {
  const { data: session } = useSession();
  const uId = session?.user?.id;
  return (
    <div
      className={`${
        userId === uId
          ? "place-self-end text-right"
          : "place-self-start text-left"
      }`}
    >
      <li
        key={id}
        className={`rounded-xl px-3 py-2 text-slate-700 shadow ${
          userId === uId
            ? "rounded-tr-none bg-[#d283fa] text-right"
            : "rounded-tl-none bg-[#8dd9fe] text-left"
        }`}
      >
        {text}
      </li>
      <span className="text-xs text-slate-300">
        {userId === uId ? "You" : userName}
      </span>
    </div>
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

export const Chat = ({
  chatId,
  history = [],
}: {
  chatId: string;
  history: any[];
}) => {
  const { messages, mutation } = useChat({ chatId });
  const [sendMessage, { error }] = mutation;

  const all = [...history, ...messages];

  return (
    // h-1 defines hegith of parent element
    // and makes child (whith h-full) grow to fill height
    <section id="chat" aria-label="chat" className="h-1 flex-grow">
      <div className="mx-auto h-full max-w-3xl pb-28 lg:pt-10">
        {/* chat window - flex-col-reverse to always scroll to the bottom of container */}
        <div className="mb-1 flex h-full flex-col-reverse overflow-auto rounded-xl bg-black/20 p-10">
          <MessageList messages={all} />
        </div>
        <MessageForm sendMessage={sendMessage} chatId={chatId} error={error} />
      </div>
    </section>
  );
};
