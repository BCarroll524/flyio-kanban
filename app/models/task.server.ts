import { db } from "~/db.server";

const addNewTask = async ({
  boardId,
  title,
  description,
  column,
  subtasks,
}: {
  boardId: string;
  title: string;
  description?: string;
  column: string;
  subtasks: string[];
}) => {
  await db.task.create({
    data: {
      title,
      description,
      column,
      subtasks: {
        create: subtasks.map((subtask) => ({ title: subtask })),
      },
      boardId,
    },
  });
};

const editTask = async ({
  taskId,
  title,
  description,
  column,
  deletedSubtasks,
  currentSubtasks,
  newSubtasks,
}: {
  taskId: string;
  title: string;
  description?: string;
  column: string;
  deletedSubtasks: string[]; // subtask ids
  currentSubtasks: { id: string; title: string }[];
  newSubtasks: string[];
}) => {
  await db.task.update({
    where: {
      id: taskId,
    },
    data: {
      title,
      description,
      column,
      subtasks: {
        create: newSubtasks.map((subtask) => ({ title: subtask })),
        update: currentSubtasks.map((subtask) => ({
          where: {
            id: subtask.id,
          },
          data: {
            title: subtask.title,
          },
        })),
      },
    },
    include: {
      subtasks: true,
    },
  });

  await db.subtask.deleteMany({
    where: {
      id: {
        in: deletedSubtasks,
      },
    },
  });
};

const deleteTask = async (taskId: string) => {
  await db.task.delete({
    where: {
      id: taskId,
    },
  });
};

const completeSubtask = (subtaskId: string, completed: boolean) => {
  return db.subtask.update({
    where: {
      id: subtaskId,
    },
    data: {
      completed,
    },
  });
};

export { addNewTask, editTask, deleteTask, completeSubtask };
