import {
  EllipsisVerticalIcon,
  PencilSquareIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";

import * as Dialog from "@radix-ui/react-dialog";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { Form } from "@remix-run/react";
import { useState } from "react";
import { Button } from "./button";
import { MultiInputs } from "./multi-inputs";
import { TextInput } from "./text-input";
import { H2, Paragraph } from "./typography";

const BoardMenu = ({
  id,
  name,
  columns,
}: {
  name: string;
  columns: string[];
  id: string;
}) => {
  const [state, setState] = useState<"edit" | "delete" | undefined>(undefined);

  const close = () => setState(undefined);

  return (
    <>
      <DropdownMenu.Root>
        <DropdownMenu.Trigger asChild>
          <button className="ml-auto outline-none">
            <EllipsisVerticalIcon className="h-5 w-5 stroke-medium-gray stroke-2" />
          </button>
        </DropdownMenu.Trigger>

        <DropdownMenu.Portal>
          <DropdownMenu.Content
            sideOffset={12}
            className="mr-4 space-y-2 rounded-md bg-light-bg p-2 shadow-md dark:bg-dark-bg"
          >
            <DropdownMenu.Item
              className="group flex w-fit cursor-pointer items-center gap-2 rounded-md py-[6px] px-2 text-purple outline-none hover:bg-purple-hover hover:text-white"
              onClick={() => setState("edit")}
            >
              <PencilSquareIcon className="h-5 w-5 stroke-purple group-hover:stroke-white" />
              Edit Board
            </DropdownMenu.Item>
            <DropdownMenu.Item
              className="group flex w-fit cursor-pointer items-center gap-2 rounded-md py-[6px] px-2 text-red outline-none hover:bg-red-hover hover:text-white"
              onClick={() => setState("delete")}
            >
              <TrashIcon className="h-5 w-5 stroke-red group-hover:stroke-white" />
              Delete Board
            </DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>

      <Dialog.Root open={state !== undefined}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black opacity-50" />
          <div className="absolute inset-0 flex items-center justify-center px-4">
            <Dialog.Content
              onInteractOutside={close}
              onEscapeKeyDown={close}
              className="w-full sm:w-fit"
            >
              <>
                {state === "edit" ? (
                  <EditBoard id={id} name={name} columns={columns} />
                ) : null}
                {state === "delete" ? (
                  <DeleteBoard id={id} name={name} />
                ) : null}
              </>
            </Dialog.Content>
          </div>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
};

const EditBoard = ({
  id,
  name,
  columns,
}: {
  id: string;
  name: string;
  columns: string[];
}) => {
  return (
    <Form
      method="post"
      className="w-full space-y-6 rounded-lg bg-white p-6 dark:bg-dark-gray sm:w-[480px] sm:p-8"
    >
      <input type="hidden" name="boardId" value={id} />
      <H2 className="text-black dark:text-white">Edit Board</H2>
      <TextInput
        label="Board Name"
        name="name"
        defaultValue={name}
        placeholder="e.g. Web Design"
      />

      <MultiInputs
        name="columns"
        label="Board Columns"
        placeholder="e.g. Todo"
        cta="+ Add New Column"
        currentInputs={columns.map((column) => ({
          key: column,
          value: column,
        }))}
      />

      <Button variant="primary" size="sm" name="_action" value="edit-board">
        Save Changes
      </Button>
    </Form>
  );
};

const DeleteBoard = ({ id, name }: { id: string; name: string }) => {
  return (
    <Form
      method="post"
      className="flex w-full flex-col gap-6 rounded-lg bg-white p-6 dark:bg-dark-gray sm:w-[480px] sm:p-8"
    >
      <input type="hidden" name="boardId" value={id} />
      <H2 className="text-red">Delete this board?</H2>
      <Paragraph size="md" className="text-medium-gray">
        {`Are you sure you want to delete the \`${name}\` board? This action will remove all columns and tasks and cannot be reversed.`}
      </Paragraph>
      <div className="flex items-center gap-4">
        <Button
          type="submit"
          variant="destructive"
          size="sm"
          name="_action"
          value="delete-board"
        >
          Delete
        </Button>
        <Button type="button" variant="secondary" size="sm">
          Cancel
        </Button>
      </div>
    </Form>
  );
};

export { BoardMenu };
