import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";
import { EllipsisVerticalIcon } from "@heroicons/react/24/solid";
import * as Dialog from "@radix-ui/react-dialog";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { Form, useFetcher } from "@remix-run/react";
import { useState } from "react";
import { Button } from "./button";
import { CheckboxGroup } from "./checkbox-group";
import { Dropdown } from "./select";
import { MultiInputs } from "./multi-inputs";
import { TextArea } from "./text-area";
import { TextInput } from "./text-input";
import { H2, Paragraph } from "./typography";

type ModalStates = "view" | "edit" | "delete";

const Task = ({
  id,
  title,
  description,
  subtasks,
  column,
  columns,
  children,
}: {
  id: string;
  title: string;
  description: string;
  subtasks: {
    id: string;
    title: string;
    completed: boolean;
  }[];
  column: string;
  columns: string[];
  children: React.ReactNode;
}) => {
  const [state, setState] = useState<ModalStates>("view");

  const subtasksCompleted = subtasks.filter(
    (subtask) => subtask.completed
  ).length;
  const subtasksTotal = subtasks.length;
  return (
    <Dialog.Root
      onOpenChange={(open) => {
        if (!open) {
          setState("view");
        }
      }}
    >
      <Dialog.Trigger asChild>{children}</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black opacity-50" />
        <div className="absolute inset-0 flex items-center justify-center">
          <Dialog.Content className="">
            <div className="max-h-[95vh] w-[480px] space-y-6 overflow-y-auto rounded-lg bg-white p-8">
              {state === "view" ? (
                <>
                  <div className="flex items-center gap-6">
                    <H2>{title}</H2>
                    <Menu onChange={(val) => setState(val)} />
                  </div>
                  <Paragraph size="md" className="text-medium-gray">
                    {description}
                  </Paragraph>

                  <CheckboxGroup
                    label={`Subtasks (${subtasksCompleted} of ${subtasksTotal})`}
                    options={subtasks}
                  />

                  <Dropdown
                    name="column"
                    label="Status"
                    options={columns}
                    disabled
                  />
                </>
              ) : state === "edit" ? (
                <EditTask
                  id={id}
                  title={title}
                  description={description}
                  subtasks={subtasks}
                  column={column}
                  columns={columns}
                />
              ) : (
                <DeleteTask
                  id={id}
                  title={title}
                  onCancel={() => setState("view")}
                />
              )}
            </div>
          </Dialog.Content>
        </div>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

const Menu = ({ onChange }: { onChange: (val: ModalStates) => void }) => {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button className="ml-auto">
          <EllipsisVerticalIcon className="h-5 w-5 stroke-medium-gray" />
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          sideOffset={12}
          className="space-y-2 rounded-full bg-light-bg p-[6px] shadow-md"
        >
          <DropdownMenu.Item
            className="group cursor-pointer rounded-full p-[6px] hover:bg-purple-hover"
            onClick={() => onChange("edit")}
          >
            <PencilSquareIcon className="h-5 w-5 stroke-purple group-hover:stroke-white" />
          </DropdownMenu.Item>
          <DropdownMenu.Item
            className="group cursor-pointer rounded-full p-[6px] hover:bg-red-hover"
            onClick={() => onChange("delete")}
          >
            <TrashIcon className="h-5 w-5 stroke-red group-hover:stroke-white" />
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
};

const EditTask = ({
  id,
  title,
  description,
  subtasks,
  column,
  columns,
}: {
  id: string;
  title: string;
  description: string;
  subtasks: {
    id: string;
    title: string;
    completed: boolean;
  }[];
  column: string;
  columns: string[];
}) => {
  const fetcher = useFetcher();
  return (
    <fetcher.Form method="post" className="w-full space-y-6">
      <H2>Edit Task</H2>
      <input type="hidden" name="taskId" value={id} />
      <TextInput
        label="Name"
        name="name"
        defaultValue={title}
        placeholder="Enter task name"
      />

      <TextArea
        label="Description"
        name="description"
        defaultValue={description}
        placeholder="Enter task description"
      />

      <MultiInputs
        name="subtasks"
        label="Subtasks"
        placeholder="e.g. Make coffee"
        currentInputs={subtasks.map((subtask) => ({
          key: subtask.id,
          value: subtask.title,
        }))}
        cta="Add New Subtask"
      />

      <Dropdown
        name="column"
        label="Status"
        options={columns}
        defaultValue={column}
      />
      <Button variant="primary" size="sm" name="_action" value="edit-task">
        Save Changes
      </Button>
    </fetcher.Form>
  );
};

const DeleteTask = ({
  id,
  title,
  onCancel,
}: {
  id: string;
  title: string;
  onCancel: () => void;
}) => {
  return (
    <Form method="post" className="w-full space-y-6">
      <input type="hidden" name="taskId" value={id} />
      <H2 className="text-red">Delete this task?</H2>
      <Paragraph size="md" className="text-medium-gray">
        {`Are you sure you want to delete the \`${title}\` task and its subtasks? This action cannot be reversed.`}
      </Paragraph>
      <div className="flex items-center gap-4">
        <Button
          type="submit"
          variant="destructive"
          size="sm"
          name="_action"
          value="delete-task"
        >
          Delete
        </Button>
        <Button type="button" variant="secondary" size="sm" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </Form>
  );
};

export { Task };
