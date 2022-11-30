import { SubmitHandler, useForm } from "react-hook-form";

type Inputs = {
  message: string;
};

export const MessageForm = ({ send }: { send: Function }) => {
  const {
    register,
    handleSubmit,
    formState: { isValid },
  } = useForm<Inputs>({ mode: "onChange" });

  const onSubmit: SubmitHandler<Inputs> = (data: Inputs) => {
    send(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-row">
      <input
        id="message"
        aria-label="message"
        {...register("message", { required: true })}
        type="text"
      />
      <button type="submit" disabled={!isValid}>
        Send
      </button>
    </form>
  );
};
