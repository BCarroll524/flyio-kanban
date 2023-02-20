import { ChevronDownIcon } from "@heroicons/react/24/solid";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { NavLink, useTransition } from "@remix-run/react";
import clsx from "clsx";
import { useEffect, useState } from "react";
import { Board as BoardIcon } from "~/icons/board";
import { H3, H4 } from "./typography";
import { NewBoard } from "./new-board";
import { MoonIcon, SunIcon } from "@heroicons/react/24/outline";
import { motion } from "framer-motion";

const BoardSelect = ({
  name,
  boards,
  disabled = false,
}: {
  name: string;
  boards: { id: string; name: string }[];
  disabled?: boolean;
}) => {
  const [open, setOpen] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const transition = useTransition();

  useEffect(() => {
    if (transition.state === "loading") {
      setOpen(false);
    }
  }, [transition.state]);

  return (
    <DropdownMenu.Root open={open}>
      <DropdownMenu.Trigger
        onClick={() => setOpen(true)}
        disabled={disabled}
        className="flex items-center gap-3 text-lg font-bold leading-lg text-black outline-none dark:text-white"
      >
        {name}
        {!disabled ? (
          <div className="flex-shrink-0 pt-1">
            <ChevronDownIcon className="h-4 w-4 stroke-purple" />
          </div>
        ) : null}
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          onInteractOutside={() => setOpen(false)}
          onEscapeKeyDown={() => setOpen(false)}
          sideOffset={32}
          className={`rounded-[6px] border border-input bg-white shadow-md dark:bg-dark-bg`}
        >
          <DropdownMenu.Item asChild>
            <H4 className="px-6 pt-4 pb-1 uppercase text-medium-gray">
              All boards ({boards.length})
            </H4>
          </DropdownMenu.Item>
          <DropdownMenu.Group>
            {boards.map((board) => (
              <DropdownLinkItem key={board.id} value={board} />
            ))}
          </DropdownMenu.Group>
          <DropdownMenu.Item asChild>
            <NewBoard>
              <button className="flex items-center gap-4 px-6 pt-[14px] pb-[15px]">
                <BoardIcon width={16} height={16} fill="#635fc7" />
                <H3 className="text-purple">+ Create new board</H3>
              </button>
            </NewBoard>
          </DropdownMenu.Item>
          <DropdownMenu.Item asChild>
            <div className="mx-6 my-4 flex items-center justify-center gap-6 rounded-md bg-light-bg py-4 transition-colors duration-200 dark:bg-dark-bg">
              <SunIcon className="h-5 w-5 text-medium-gray dark:text-white" />
              <div
                className="relative h-5 w-10 cursor-pointer rounded-full bg-purple p-[3px]"
                onClick={() => {
                  setTheme(theme === "light" ? "dark" : "light");
                }}
              >
                <motion.div
                  className="absolute h-[14px] w-[14px] rounded-full bg-white"
                  variants={variants}
                  initial="light"
                  animate={theme}
                />
              </div>
              <MoonIcon className="h-5 w-5 fill-medium-gray stroke-medium-gray dark:fill-white dark:stroke-white" />
            </div>
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
};

const variants = {
  light: { left: 3, right: "unset" },
  dark: { right: 3, left: "unset" },
};

const DropdownLinkItem = ({
  value,
}: {
  value: { id: string; name: string };
}) => {
  return (
    <DropdownMenu.Item asChild>
      <div className="pr-8">
        <NavLink to={`/${value.id}`}>
          {({ isActive }) => {
            console.log({
              id: value.id,
              isActive,
            });
            return (
              <div
                className={clsx(
                  "mr-8 flex w-full cursor-pointer select-none items-center gap-4 px-6 pt-[14px] pb-[15px]",
                  isActive ? "rounded-r-full bg-purple" : ""
                )}
              >
                <div className="flex-shrink-0">
                  <BoardIcon
                    width={16}
                    height={16}
                    fill={isActive ? "white" : undefined}
                  />
                </div>
                <H3
                  className={clsx(isActive ? "text-white" : "text-medium-gray")}
                >
                  {value.name}
                </H3>
              </div>
            );
          }}
        </NavLink>
      </div>
    </DropdownMenu.Item>
  );
};

export { BoardSelect };
