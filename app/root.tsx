import type { ActionArgs, LinksFunction, MetaFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { json } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";

import tailwindStylesheetUrl from "./styles/tailwind.css";
import fontStylesheetUrl from "./styles/font.css";
import { badRequest } from "remix-utils";
import invariant from "tiny-invariant";
import { z } from "zod";
import { addNewBoard } from "./models/board.server";
import { getErrorMessage } from "./utils";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

export const links: LinksFunction = () => {
  return [
    { rel: "stylesheet", href: tailwindStylesheetUrl },
    {
      rel: "stylesheet",
      href: fontStylesheetUrl,
    },
  ];
};

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "Flyio Kanban",
  viewport: "width=device-width,initial-scale=1",
});

export default function App() {
  return (
    <html lang="en" className="h-full">
      <head>
        <Meta />
        <Links />
      </head>
      <body className="h-full">
        <DndProvider backend={HTML5Backend}>
          <Outlet />
        </DndProvider>
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}

export const action = async ({ request }: ActionArgs) => {
  try {
    const form = new URLSearchParams(await request.text());

    console.log(form);

    const name = form.get("name");
    const columnsStr = form.get("new-columns");

    invariant(name, "name is required");
    invariant(columnsStr, "columns is required");

    const schema = z.array(
      z.object({
        key: z.string(),
        value: z.string(),
      })
    );

    const newColumns = schema.safeParse(JSON.parse(columnsStr));

    if (!newColumns.success) {
      throw new Error("Invalid multi inputs schema");
    }

    const board = await addNewBoard({
      name,
      columns: newColumns.data.map((val) => val.value),
    });

    return redirect(`/${board.id}`);
  } catch (error: unknown) {
    const message = getErrorMessage(error);
    return badRequest({
      message,
    });
  }
};
