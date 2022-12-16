import { SubmitHandler, useForm } from "react-hook-form";

type Inputs = {
  message: string;
};

export const MessageForm = ({ send }: { send: (data: Inputs) => void }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { isValid },
  } = useForm<Inputs>({ mode: "onChange" });

  const onSubmit: SubmitHandler<Inputs> = (data: Inputs) => {
    send(data);
    reset();
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-row rounded-xl
       border-t-2 bg-white p-4"
    >
      <textarea
        className="flex-grow rounded bg-slate-100 p-2"
        id="message"
        aria-label="message"
        {...register("message", { required: true })}
        placeholder="Type your message..."
        rows={1}
      />
      <div>
        <button className="btn-blue ml-5" type="submit" disabled={!isValid}>
          Send
        </button>
      </div>
    </form>
  );
};
