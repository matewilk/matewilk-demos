import { useChat } from "@/hooks/useChat";

type Message = {
  id: string;
  text: string;
  sender: string;
};

export const ChatWindow = () => {
  const { messages } = useChat();
  return (
    // h-1 defines hegith of parent element
    // and makes child (whith h-full) grow to fill height
    <section id="chat" aria-label="chat" className="h-1 flex-grow">
      <div className="h-full bg-blue-100 py-10">
        <div className="mx-auto flex h-full min-h-full max-w-3xl flex-col items-end justify-end gap-4 overflow-auto rounded-xl bg-white p-10">
          {messages.map((message: Message) => (
            <div key={message.id} className={"w-full"}>
              <div
                className={`inline-block rounded px-3 py-2 shadow ${
                  message.sender === "user"
                    ? "float-right bg-blue-100 text-right"
                    : "bg-green-100 text-left"
                }`}
              >
                {message.text}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
