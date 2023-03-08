import { MutationFunction } from "@apollo/client";
import { SubmitHandler, useForm } from "react-hook-form";
import { useSession } from "next-auth/react";

type Inputs = {
  message: string;
};

export const MessageForm = ({
  sendMessage,
  chatId,
  error,
}: {
  sendMessage: MutationFunction;
  chatId: string;
  error: any;
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { isValid },
  } = useForm<Inputs>({ mode: "onChange" });

  const { data: session } = useSession();
  const user = session?.user;

  const onSubmit: SubmitHandler<Inputs> = (data: Inputs) => {
    const { message } = data;
    // TODO: get userId from context
    const userId = user?.id;
    const userName = user?.name;
    sendMessage({ variables: { text: message, chatId, userId, userName } });
    if (!error) reset();
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-row rounded-xl
       border-t-2 bg-white p-4"
    >
      <div className="flex flex-grow flex-col">
        <textarea
          className="max-h-16 rounded bg-slate-100 p-2"
          id="message"
          aria-label="message"
          {...register("message", { required: true })}
          placeholder="Type your message..."
          rows={1}
        />
        <p className="text-sm text-red-600">
          {error ? "Something went wrong. Please try again." : undefined}
        </p>
      </div>

      <div>
        <button className="btn-blue ml-5" type="submit" disabled={!isValid}>
          Send
        </button>
      </div>
    </form>
  );
};
