import * as React from "react";
import clsx from "clsx";

type TitleProps = {
  as?: React.ElementType;
  className?: string;
  id?: string;
} & (
  | { children: React.ReactNode }
  | {
      dangerouslySetInnerHTML: {
        __html: string;
      };
    }
);

const fontSize = {
  h1: "leading-xl text-xl font-bold",
  h2: "leading-lg text-lg font-bold",
  h3: "leading-md text-md font-bold",
  h4: "leading-sm text-sm font-bold tracking-sm",
};

function Title({
  size,
  as,
  className,
  ...rest
}: TitleProps & { size: keyof typeof fontSize }) {
  const Tag = as ?? size;
  return <Tag className={clsx(fontSize[size], className)} {...rest} />;
}

function H1(props: TitleProps) {
  return <Title {...props} size="h1" />;
}

function H2(props: TitleProps) {
  return <Title {...props} size="h2" />;
}

function H3(props: TitleProps) {
  return <Title {...props} size="h3" />;
}

function H4(props: TitleProps) {
  return <Title {...props} size="h4" />;
}

type ParagraphProps = {
  size: "sm" | "md";
  className?: string;
  as?: React.ElementType;
} & (
  | { children: React.ReactNode }
  | { dangerouslySetInnerHTML: { __html: string } }
);

function Paragraph({ size, className, as = "p", ...rest }: ParagraphProps) {
  return React.createElement(as, {
    className: clsx(
      "max-w-full",
      size === "sm"
        ? "text-xs leading-sm font-bold"
        : "text-md leading-md font-medium",
      className
    ),
    ...rest,
  });
}

export { H1, H2, H3, H4, Paragraph };
