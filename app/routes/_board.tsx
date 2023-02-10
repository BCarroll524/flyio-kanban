import { useLoaderData, Outlet, NavLink } from "@remix-run/react";
import clsx from "clsx";
import { H3, H4 } from "~/components/typography";
import { Board as BoardIcon } from "~/icons/board";
import { Logo } from "~/icons/logo";
import { MoonIcon, SunIcon } from "@heroicons/react/24/outline";
import { motion } from "framer-motion";
import { useState } from "react";
import { json } from "@remix-run/node";
import { db } from "~/db.server";
import { NewBoard } from "~/components/new-board";

export const loader = async () => {
  const boards = await db.board.findMany({
    select: {
      id: true,
      name: true,
    },
  });

  return json({ boards });
};

export default function Layout() {
  const data = useLoaderData<typeof loader>();
  const [theme, setTheme] = useState<"light" | "dark">("light");

  return (
    <main
      className={clsx(
        "relative flex min-h-screen flex-row",
        theme === "dark" ? "dark" : ""
      )}
    >
      <aside className="hidden min-h-screen flex-col border-r border-light-lines bg-white transition-colors duration-200 dark:border-dark-lines dark:bg-dark-gray sm:flex sm:w-[260px] md:w-[300px]">
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

        <div className="mx-6 mt-auto mb-10 flex items-center justify-center gap-6 rounded-md bg-light-bg py-4 transition-colors duration-200 dark:bg-dark-bg">
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
      </aside>
      <Outlet />
    </main>
  );
}

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
            "flex w-full cursor-pointer items-center gap-4 px-8 pt-[14px] pb-[15px]",
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
            <H3 className={clsx(isActive ? "text-white" : "text-medium-gray")}>
              {name}
            </H3>
          </>
        )}
      </NavLink>
    </li>
  );
};
