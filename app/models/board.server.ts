import { db } from "~/db.server";

const addNewBoard = async ({
  name,
  columns,
}: {
  name: string;
  columns: string[];
}) => {
  return db.board.create({
    data: {
      name,
      columns,
    },
  });
};

const editBoard = async ({
  boardId,
  name,
  deletedColumns,
  currentColumns,
  newColumns,
}: {
  boardId: string;
  name: string;
  deletedColumns: string[];
  currentColumns: { id: string; title: string }[];
  newColumns: string[];
}) => {
  // delete tasks associated with deleted columns
  await db.task.deleteMany({
    where: { boardId, column: { in: deletedColumns } },
  });

  // update tasks associated with current columns that got name changed
  const currentColumnsToUpdate = currentColumns.filter(
    (column) => column.title !== column.id
  );
  for (const column of currentColumnsToUpdate) {
    await db.task.updateMany({
      where: { boardId, column: column.id },
      data: { column: column.title },
    });
  }

  // update board
  const columns = [
    ...currentColumnsToUpdate.map((column) => column.title),
    ...newColumns,
  ];
  await db.board.update({
    where: { id: boardId },
    data: {
      name,
      columns,
    },
  });
};

const deleteBoard = async (boardId: string) => {
  await db.board.delete({
    where: {
      id: boardId,
    },
  });
};

export { addNewBoard, editBoard, deleteBoard };
