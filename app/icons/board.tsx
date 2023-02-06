import type { SVGProps } from "react";

const Board = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width={16}
    height={16}
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M.846.846A2.889 2.889 0 0 0 0 2.89V13.11A2.889 2.889 0 0 0 2.889 16H13.11A2.888 2.888 0 0 0 16 13.111V2.89A2.888 2.888 0 0 0 13.111 0H2.89C2.123 0 1.388.304.846.846Zm.487 12.265V8.444h8.445v6.223h-6.89a1.556 1.556 0 0 1-1.555-1.556Zm8.445-6V1.333h-6.89A1.556 1.556 0 0 0 1.334 2.89V7.11h8.445Zm1.333-1.333h3.556v4.444H11.11V5.778Zm3.556 5.778H11.11v3.11h2a1.556 1.556 0 0 0 1.556-1.555v-1.556Zm0-8.667v1.555H11.11v-3.11h2a1.556 1.556 0 0 1 1.556 1.555Z"
      fill={props.fill || "#828FA3"}
    />
  </svg>
);

export { Board };
