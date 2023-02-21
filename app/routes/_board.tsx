import { useLoaderData, Outlet, NavLink } from "@remix-run/react";
import clsx from "clsx";
import { H3, H4 } from "~/components/typography";
import { Board as BoardIcon } from "~/icons/board";
import { Logo } from "~/icons/logo";
import {
  EyeIcon,
  EyeSlashIcon,
  MoonIcon,
  SunIcon,
} from "@heroicons/react/24/outline";
import { motion } from "framer-motion";
import { useState } from "react";
import { json } from "@remix-run/node";
import { db } from "~/db.server";
import { NewBoard } from "~/components/new-board";
import type { Handle } from "types";
import { useMatchLoaderData } from "~/utils/providers";
import { useTheme } from "~/utils/theme-providers";

export const handle: Handle = {
  id: "_board",
};

type LoaderData = {
  boards: Array<{ id: string; name: string }>;
};

export const loader = async () => {
  const boards = await db.board.findMany({
    select: {
      id: true,
      name: true,
    },
  });

  return json<LoaderData>({ boards });
};

export default function Layout() {
  const data = useLoaderData<typeof loader>();
  const [theme, setTheme] = useTheme();
  const [showSidebar, setShowSidebar] = useState(true);

  return (
    <main
      className={clsx(
        "relative flex min-h-screen flex-row",
        "bg-white dark:bg-dark-bg"
      )}
    >
      <motion.aside
        variants={asideVariants}
        initial="show"
        animate={showSidebar ? "show" : "hide"}
        className="absolute bg-white dark:bg-dark-gray"
        transition={{ ease: "easeInOut", duration: 0.2 }}
      >
        <div className="hidden min-h-screen flex-col border-r border-light-lines bg-white transition-colors duration-200 dark:border-dark-lines dark:bg-dark-gray sm:flex sm:w-[260px]">
          <div className="mt-8 ml-8">
            <Logo />
          </div>
          <nav className="mt-[54px]">
            <H4 className="px-8 uppercase text-medium-gray">
              All boards ({data.boards.length})
            </H4>
            <ul className="pr-6 pt-5">
              {data.boards.map((board) => (
                <NavItem key={board.id} slug={board.id} name={board.name} />
              ))}
            </ul>
            <NewBoard>
              <button className="flex items-center gap-4 px-8 pt-[14px] pb-[15px]">
                <BoardIcon width={16} height={16} fill="#635fc7" />
                <H3 className="text-purple">+ Create new board</H3>
              </button>
            </NewBoard>
          </nav>

          <div className="mx-6 mb-8 mt-auto flex items-center justify-center gap-6 rounded-md bg-light-bg py-4 transition-colors duration-200 dark:bg-dark-bg">
            <SunIcon className="h-5 w-5 text-medium-gray dark:text-white" />
            <div
              className="relative h-5 w-10 cursor-pointer rounded-full bg-purple p-[3px]"
              onClick={() => {
                setTheme((prevTheme) =>
                  prevTheme === "light" ? "dark" : "light"
                );
              }}
            >
              <motion.div
                className="absolute h-[14px] w-[14px] rounded-full bg-white"
                variants={variants}
                initial="light"
                animate={theme === "light" ? "light" : "dark"}
              />
            </div>
            <MoonIcon className="h-5 w-5 fill-medium-gray stroke-medium-gray dark:fill-white dark:stroke-white" />
          </div>
          <button
            className="mb-12 flex gap-2 px-6"
            onClick={() => setShowSidebar(false)}
          >
            <EyeSlashIcon className="h-5 w-5 stroke-medium-gray stroke-2" />
            <H3 className="text-medium-gray">Hide Sidebar</H3>
          </button>
        </div>
      </motion.aside>

      <motion.div
        variants={mainVariants}
        initial="show"
        animate={showSidebar ? "show" : "hide"}
        className="w-full"
        transition={{ ease: "easeInOut", duration: 0.2 }}
      >
        <Outlet />
      </motion.div>
      {!showSidebar ? (
        <div className="absolute left-0 bottom-12">
          <button
            onClick={() => setShowSidebar(true)}
            className="flex items-center justify-center rounded-r-full bg-purple p-4 hover:bg-purple-hover"
          >
            <EyeIcon className="h-5 w-5 stroke-white stroke-2" />
          </button>
        </div>
      ) : null}
    </main>
  );
}

const asideVariants = {
  show: { x: 0 },
  hide: { x: "-100%" },
};

const mainVariants = {
  show: { paddingLeft: "260px" },
  hide: { paddingLeft: "0" },
};

const variants = {
  light: { left: 3, right: "unset" },
  dark: { right: 3, left: "unset" },
};

const NavItem = ({ slug, name }: { slug: string; name: string }) => {
  return (
    <li>
      <NavLink
        to={slug}
        className={({ isActive }) =>
          clsx(
            "group flex w-full cursor-pointer items-center gap-4 px-8 pt-[14px] pb-[15px]",
            isActive ? "rounded-r-full bg-purple" : ""
          )
        }
      >
        {({ isActive }) => (
          <>
            <BoardIcon
              width={16}
              height={16}
              fill={isActive ? "white" : undefined}
            />
            <H3
              className={clsx(
                isActive ? "text-white" : "text-medium-gray",
                "group-hover:text-white"
              )}
            >
              {name}
            </H3>
          </>
        )}
      </NavLink>
    </li>
  );
};

export const useBoards = () => useMatchLoaderData<LoaderData>(handle.id);
