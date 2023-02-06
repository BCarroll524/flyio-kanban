import clsx from "clsx";

type ButtonProps = {
  size: "lg" | "sm";
  variant: "primary" | "secondary" | "destructive";
  type?: "submit" | "button";
  children: React.ReactNode;
  onClick?: () => void;
  name?: string;
  value?: string;
  className?: string;
};

const buttonSizes = {
  lg: "rounded-full text-md py-[14px] font-bold leading-md",
  sm: "rounded-full text-sm py-2 leading-lg font-bold",
};

const buttonVariants = {
  primary:
    "bg-purple hover:bg-purple-hover text-white outline-purple outline-offset-2",
  secondary:
    "bg-secondary-button hover:bg-secondary-button-hover text-purple dark:bg-white dark:hover:bg-white outline-purple outline-offset-2",
  destructive:
    "bg-red hover:bg-red-hover text-white outline-red outline-offset-2",
};

function Button({
  size,
  variant,
  children,
  type = "submit",
  className,
  onClick,
  name,
  value,
  ...rest
}: ButtonProps) {
  return (
    <button
      type={type}
      name={name}
      value={value}
      onClick={() => {
        if (onClick) {
          onClick();
        }
      }}
      className={clsx(
        "w-full px-[18px]",
        "",
        buttonSizes[size],
        buttonVariants[variant],
        className
      )}
      {...rest}
    >
      {children}
    </button>
  );
}

export { Button };
