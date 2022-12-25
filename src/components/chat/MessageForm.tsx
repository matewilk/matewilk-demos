import { MutationFunction } from "@apollo/client";
import { SubmitHandler, useForm } from "react-hook-form";

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

  const onSubmit: SubmitHandler<Inputs> = (data: Inputs) => {
    const { message } = data;
    const userId = "1";
    sendMessage({ variables: { text: message, chatId, userId } });
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
          className="rounded bg-slate-100 p-2"
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
