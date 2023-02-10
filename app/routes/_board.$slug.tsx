import type { Subtask, Task as PrismaTask } from "@prisma/client";
import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useFetcher, useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";
import { db } from "~/db.server";
import { H1, H3, H4, Paragraph } from "~/components/typography";
import clsx from "clsx";
import type { MouseEvent } from "react";
import { useEffect, useRef, useState } from "react";
import { NewTaskModal } from "~/components/new-task";
import { Task as TaskComponent } from "~/components/task";
import { BoardMenu } from "~/components/board-menu";
import {
  addNewTask,
  completeSubtask,
  deleteTask,
  editTask,
  moveTask,
} from "~/models/task.server";
import { badRequest } from "remix-utils";
import { getErrorMessage } from "~/utils";
import { z } from "zod";
import { editBoard, deleteBoard } from "~/models/board.server";
import { useDrag, useDrop } from "react-dnd";
import { MobileLogo } from "~/icons/mobile-logo";
import { BoardSelect } from "~/components/board-select";

type Task = Omit<PrismaTask, "createdAt" | "updatedAt" | "boardId"> & {
  subtasks: Pick<Subtask, "id" | "title" | "completed">[];
};

export const loader = async ({ params }: LoaderArgs) => {
  invariant(params.slug, "Slug is required");

  const board = await db.board.findUnique({
    where: {
      id: params.slug,
    },
    select: {
      id: true,
      name: true,
      columns: true,
      tasks: {
        select: {
          id: true,
          title: true,
          description: true,
          column: true,
          subtasks: {
            select: {
              id: true,
              title: true,
              completed: true,
            },
            orderBy: {
              createdAt: "asc",
            },
          },
        },
        orderBy: {
          createdAt: "asc",
        },
      },
    },
  });

  if (!board) {
    throw new Error("Board not found");
  }

  const columns: Record<string, Task[]> = {};
  board.columns.forEach((column) => (columns[column] = []));
  board.tasks.forEach((task) => {
    if (!columns[task.column]) {
      columns[task.column] = [];
    }

    columns[task.column].push(task);
  });

  return json({
    id: board.id,
    name: board.name,
    columns,
  });
};

export const action = async ({ request, params }: ActionArgs) => {
  invariant(params.slug, "params.slug is required");
  const form = new URLSearchParams(await request.text());

  console.log({ form });

  try {
    const action = form.get("_action");

    if (action === "new-task") {
      const title = form.get("name");
      const description = form.get("description") || undefined;
      const column = form.get("column");
      const subtasks = form.getAll("subtasks");

      invariant(title, "title is required");
      invariant(column, "column is required");
      invariant(subtasks, "subtasks is required");

      await addNewTask({
        boardId: params.slug,
        title,
        description,
        column,
        subtasks,
      });

      return json({}, { status: 201 });
    }

    if (action === "edit-task") {
      const taskId = form.get("taskId");
      const title = form.get("name");
      const description = form.get("description") || undefined;
      const column = form.get("column");
      const deletedSubtasks = form.getAll("deleted-subtasks");
      const oldSubtasksStr = form.get("old-subtasks");
      const newSubtasksStr = form.get("new-subtasks");

      invariant(taskId, "taskId is required");
      invariant(title, "title is required");
      invariant(column, "column is required");
      invariant(deletedSubtasks, "deletedSubtasks is required");
      invariant(oldSubtasksStr, "oldSubtasks is required");
      invariant(newSubtasksStr, "newSubtasks is required");

      // validate schema for old and new subtasks
      const schema = z.array(
        z.object({
          key: z.string(),
          value: z.string(),
        })
      );

      const oldSubtasks = schema.safeParse(JSON.parse(oldSubtasksStr));
      const newSubtasks = schema.safeParse(JSON.parse(newSubtasksStr));

      if (!oldSubtasks.success || !newSubtasks.success) {
        throw new Error("Invalid multi inputs schema");
      }

      await editTask({
        taskId,
        title,
        description,
        column,
        deletedSubtasks,
        currentSubtasks: oldSubtasks.data.map((val) => ({
          id: val.key,
          title: val.value,
        })),
        newSubtasks: newSubtasks.data.map((val) => val.value),
      });

      return json({
        ok: true,
        message: "Task updated successfully",
      });
    }

    if (action === "delete-task") {
      const taskId = form.get("taskId");
      invariant(taskId, "taskId is required");
      await deleteTask(taskId);
      return json({
        ok: true,
        message: "Task deleted successfully",
      });
    }

    if (action === "complete-subtask") {
      const subtaskId = form.get("subtaskId");
      const completed = form.get("completed") === "on";
      invariant(subtaskId, "subtaskId is required");

      await completeSubtask(subtaskId, completed);

      return json({
        ok: true,
        message: `Subtask ${
          completed ? "completed" : "uncompleted"
        } successfully`,
      });
    }

    if (action === "move-task") {
      const taskId = form.get("taskId");
      const column = form.get("column");
      invariant(taskId, "taskId is required");
      invariant(column, "column is required");

      await moveTask(taskId, column);
      return json({
        ok: true,
        message: "Task moved successfully",
      });
    }

    if (action === "delete-board") {
      const boardId = form.get("boardId");
      invariant(boardId, "boardId is required");
      await deleteBoard(boardId);

      return redirect("/");
    }

    if (action === "edit-board") {
      const boardId = form.get("boardId");
      const name = form.get("name");
      const deletedColumns = form.getAll("deleted-columns");
      const oldColumnsStr = form.get("old-columns");
      const newColumnsStr = form.get("new-columns");

      invariant(boardId, "boardId is required");
      invariant(name, "name is required");
      invariant(deletedColumns, "deletedColumns is required");
      invariant(oldColumnsStr, "oldColumns is required");
      invariant(newColumnsStr, "newColumns is required");

      // validate schema for old and new Columns
      const schema = z.array(
        z.object({
          key: z.string(),
          value: z.string(),
        })
      );

      const oldColumns = schema.safeParse(JSON.parse(oldColumnsStr));
      const newColumns = schema.safeParse(JSON.parse(newColumnsStr));

      if (!oldColumns.success || !newColumns.success) {
        throw new Error("Invalid multi inputs schema");
      }

      await editBoard({
        boardId,
        name,
        deletedColumns,
        currentColumns: oldColumns.data.map((val) => ({
          id: val.key,
          title: val.value,
        })),
        newColumns: newColumns.data.map((val) => val.value),
      });

      return json({
        ok: true,
        message: "Board updated successfully",
      });
    }
  } catch (error: unknown) {
    const message = getErrorMessage(error);
    return badRequest({
      message,
    });
  }

  return json({});
};

export default function Board() {
  const { id: boardId, name, columns } = useLoaderData<typeof loader>();
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPost] = useState({ top: 0, left: 0, x: 0, y: 0 });
  const [mouseDown, setMouseDown] = useState(false);
  const [cmdDown, setCmdDown] = useState(false);

  useEffect(() => {
    const cmdDownHandler = (event: KeyboardEvent) => {
      if (event.key === "Meta" && ref.current) {
        setCmdDown(true);
        ref.current.style.cursor = "grab";
      }
    };
    const cmdUpHandler = (event: KeyboardEvent) => {
      if (event.key === "Meta" && ref.current) {
        setCmdDown(false);
        ref.current.style.cursor = "default";
      }
    };

    document.addEventListener("keydown", cmdDownHandler);
    document.addEventListener("keyup", cmdUpHandler);

    return () => {
      document.removeEventListener("keydown", cmdDownHandler);
      document.removeEventListener("keyup", cmdUpHandler);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ref.current]);

  useEffect(() => {
    const mouseMoveHandler = (event: globalThis.MouseEvent) => {
      // How far the mouse has been moved
      const dx = event.clientX - pos.x;
      const dy = event.clientY - pos.y;

      if (ref.current && cmdDown && mouseDown) {
        // Scroll the element
        ref.current.scrollTop = pos.top - dy;
        ref.current.scrollLeft = pos.left - dx;
      }
    };

    document.addEventListener("mousemove", mouseMoveHandler);

    return () => document.removeEventListener("mousemove", mouseMoveHandler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mouseDown, ref.current, cmdDown]);

  const mouseUpHandler = () => {
    setMouseDown(false);

    if (ref.current) {
      ref.current.style.removeProperty("user-select");
    }
  };

  const mouseDownHandler = (event: MouseEvent<HTMLDivElement>) => {
    setMouseDown(true);
    if (ref.current && cmdDown) {
      setPost({
        top: ref.current.scrollTop,
        left: ref.current.scrollLeft,
        x: event.clientX,
        y: event.clientY,
      });

      ref.current.style.cursor = "grabbing";
      ref.current.style.userSelect = "none";
    }
  };

  return (
    <section className="flex max-h-screen min-h-screen flex-1 flex-col overflow-hidden bg-light-bg transition-colors duration-200 dark:bg-dark-bg">
      <header className="flex items-center justify-between bg-white py-4 px-6 transition-colors duration-200  dark:bg-dark-gray">
        <div className="sm:hidden">
          <MobileLogo />
        </div>
        <H1 className="hidden text-black transition-colors duration-200 dark:text-white sm:block">
          {name}
        </H1>
        <div className="flex-1 px-4 sm:hidden">
          <BoardSelect name="board" options={[]} />
        </div>
        <div className="flex gap-3 pr-0 sm:pr-6">
          <NewTaskModal columns={Object.keys(columns)} />
          <BoardMenu id={boardId} name={name} columns={Object.keys(columns)} />
        </div>
      </header>
      <section
        ref={ref}
        className="dark:scrollbar- dark:scrollbar-rounded-[full] flex flex-1 overflow-x-scroll px-4 pt-6 pb-0 overflow-y-hidden"
        onMouseDown={mouseDownHandler}
        onMouseUp={mouseUpHandler}
      >
        {Object.entries(columns).map(([name, tasks], index) => (
          <Column key={name} name={name} tasks={tasks} index={index} />
        ))}
      </section>
    </section>
  );
}

const Column = ({
  name,
  tasks,
  index,
}: {
  name: string;
  tasks: Task[];
  index: number;
}) => {
  const circleColor =
    index % 3 === 0 ? "bg-green" : index % 3 === 1 ? "bg-violet" : "bg-blue";

  const fetcher = useFetcher();
  const [{ canDrop, isOver }, drop] = useDrop(
    () => ({
      accept: "task",
      drop: (item: { id: string }) => {
        // submit form with column name and task id
        fetcher.submit(
          {
            _action: "move-task",
            taskId: item.id,
            column: name,
          },
          { method: "post" }
        );
      },
      collect: (monitor) => {
        return {
          isOver: monitor.isOver(),
          canDrop: monitor.canDrop(),
          item: monitor.getItem<{ id: string }>(),
        };
      },
    }),
    [tasks, name]
  );

  const isActive = canDrop && isOver;

  return (
    <div className="flex select-none flex-col gap-6">
      <div className="flex items-center gap-3 px-3">
        <div className={clsx("h-[15px] w-[15px] rounded-full", circleColor)} />
        <H4 className="uppercase text-medium-gray">
          {name} ({tasks.length})
        </H4>
      </div>
      <ul ref={drop} className="h-full w-[280px] space-y-5 overflow-auto">
        {isActive && (
          <div className="mx-3 h-[90px] rounded-lg bg-light-lines" />
        )}
        {tasks.map((task) => (
          <TaskTile key={task.id} task={task} />
        ))}
      </ul>
    </div>
  );
};

const TaskTile = ({ task }: { task: Task }) => {
  const { columns } = useLoaderData<typeof loader>();
  const completedSubtasks = task.subtasks.filter(
    (subtask) => subtask.completed
  ).length;
  const totalSubtasks = task.subtasks.length;

  const [{ isDragging }, drag, dragPreview] = useDrag(() => ({
    type: "task",
    item: { id: task.id },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  return (
    <div className="mx-3 last:pb-6">
      <TaskComponent {...task} columns={Object.keys(columns)}>
        <button type="button" className="w-full">
          <article
            ref={drag}
            className={clsx(
              "flex cursor-pointer flex-col items-start gap-2 rounded-lg  bg-white shadow-md transition-colors duration-200 dark:bg-dark-gray",
              isDragging ? "h-0 overflow-hidden p-0" : "px-4 py-6"
            )}
          >
            {!isDragging ? (
              <>
                <H3
                  className={clsx(
                    "text-left transition-colors duration-200 dark:text-white",
                    isDragging ? "text-light-lines" : "text-black"
                  )}
                >
                  {task.title}
                </H3>
                <Paragraph
                  size="sm"
                  className={clsx(
                    isDragging ? "text-light-lines" : "text-medium-gray"
                  )}
                >
                  {totalSubtasks
                    ? `
              ${completedSubtasks} of ${totalSubtasks} subtasks`
                    : "No subtasks"}
                </Paragraph>
              </>
            ) : null}
          </article>
        </button>
      </TaskComponent>
    </div>
  );
};
