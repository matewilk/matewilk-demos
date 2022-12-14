export const useChat = () => {
  return {
    messages: [
      { id: "1", text: "Hello", sender: "user" },
      { id: "2", text: "Hi", sender: "other" },
      {
        id: "3",
        text: "lorem ipsum tra la la, I don't know what this is all is and we'll see how it goes if I am a really long message",
        sender: "other",
      },
      { id: "4", text: "this looks preetty good to be honest", sender: "user" },
    ],
  };
};
