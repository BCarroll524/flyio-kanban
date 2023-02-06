import clsx from "clsx";
import { Paragraph } from "./typography";

const TextInput = ({
  name,
  label,
  defaultValue,
  placeholder,
  error,
  className,
}: {
  name: string;
  label: string;
  defaultValue?: string;
  placeholder?: string;
  error?: string;
  className?: string;
}) => {
  return (
    <div className="flex flex-col space-y-2">
      <label
        htmlFor={name}
        className="font-sans text-sm font-medium text-medium-gray dark:text-white"
      >
        {label}
      </label>
      <input
        type="text"
        name={name}
        id={name}
        defaultValue={defaultValue}
        className={clsx(
          "rounded-[4px] border border-input px-4 py-2 text-md font-medium leading-md text-black placeholder:text-input focus:outline-none  dark:placeholder:text-dark-lines ",
          !error
            ? "focus:ring-2 focus:ring-purple-hover focus:ring-offset-1"
            : "border-red ring-0",
          className
        )}
        placeholder={placeholder}
      />
      {error && (
        <Paragraph size="sm" className="text-red">
          {error}
        </Paragraph>
      )}
    </div>
  );
};

export { TextInput };
