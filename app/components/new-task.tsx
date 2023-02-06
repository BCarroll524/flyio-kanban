import * as Dialog from "@radix-ui/react-dialog";
import { Form } from "@remix-run/react";
import { Button } from "./button";
import { Dropdown } from "./select";
import { MultiInputs } from "./multi-inputs";
import { TextArea } from "./text-area";
import { TextInput } from "./text-input";
import { H2 } from "./typography";

const NewTaskModal = ({ columns }: { columns: string[] }) => {
  return (
    <Dialog.Root>
      <Dialog.Trigger className="rounded-full bg-purple px-[18px] py-2 text-sm font-bold text-white hover:bg-purple-hover">
        Add new task
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black opacity-50" />
        <div className="absolute inset-0 flex items-center justify-center">
          <Dialog.Content className="">
            <Form
              method="post"
              className="w-[480px] space-y-6 rounded-lg bg-white p-8"
            >
              <H2>Add New Task</H2>
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
