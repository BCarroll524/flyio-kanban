import { H2 } from "~/components/typography";
import { NewBoard } from "~/components/new-board";
import type { ActionArgs } from "@remix-run/server-runtime";
import { redirect } from "@remix-run/server-runtime";
import { badRequest } from "remix-utils";
import invariant from "tiny-invariant";
import { z } from "zod";
import { addNewBoard } from "~/models/board.server";
import { getErrorMessage } from "~/utils";

export default function Index() {
  return (
    <section className="flex min-h-screen flex-1 flex-col bg-light-bg transition-colors duration-200 dark:bg-dark-bg">
      <div className="flex flex-1 flex-col items-center justify-center gap-6">
        <H2 className="text-medium-gray">Create a new board to get started</H2>
        <NewBoard>
          <button className="w-fit rounded-full bg-purple py-[14px] px-[18px] text-md font-bold leading-md text-white outline-none hover:bg-purple-hover">
            Add new board
          </button>
        </NewBoard>
      </div>
    </section>
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
