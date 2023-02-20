import * as Dialog from "@radix-ui/react-dialog";
import { Form } from "@remix-run/react";
import { Button } from "./button";
import { Dropdown } from "./select";
import { MultiInputs } from "./multi-inputs";
import { TextArea } from "./text-area";
import { TextInput } from "./text-input";
import { H2 } from "./typography";
import { PlusIcon } from "@heroicons/react/24/solid";

const NewTaskModal = ({ columns }: { columns: string[] }) => {
  return (
    <Dialog.Root>
      <Dialog.Trigger className="rounded-full bg-purple px-[18px] py-2 text-sm font-bold text-white outline-offset-2 outline-purple hover:bg-purple-hover">
        <span className="sm:hidden">
          <PlusIcon className="h-5 w-5 fill-white stroke-white stroke-2" />
        </span>
        <span className="hidden sm:block">Add new task</span>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black opacity-50" />
        <div className="absolute inset-0 flex items-center justify-center px-4">
          <Dialog.Content className="w-full sm:w-fit">
            <Form
              method="post"
              className="w-full space-y-6 rounded-lg bg-white p-6 dark:bg-dark-gray sm:w-[480px] sm:p-8"
            >
              <H2 className="text-black dark:text-white">Add New Task</H2>
              <TextInput
                label="Name"
                name="name"
                placeholder="Enter task name"
              />

              <TextArea
                label="Description"
                name="description"
                placeholder="Enter task description"
              />

              <MultiInputs
                name="subtasks"
                label="Subtasks"
                placeholder="e.g. Make coffee"
                cta="Add New Subtask"
              />

              <Dropdown name="column" label="Status" options={columns} />
              <Button
                variant="primary"
                size="sm"
                name="_action"
                value="new-task"
              >
                Create Task
              </Button>
            </Form>
          </Dialog.Content>
        </div>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export { NewTaskModal };
