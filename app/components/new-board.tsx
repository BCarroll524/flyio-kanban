import * as Dialog from "@radix-ui/react-dialog";
import { Form } from "@remix-run/react";
import { Button } from "./button";
import { MultiInputs } from "./multi-inputs";
import { TextInput } from "./text-input";
import { H2 } from "./typography";

const NewBoard = ({ children }: { children: React.ReactNode }) => {
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>{children}</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black opacity-50" />
        <div className="absolute inset-0 flex items-center justify-center px-4">
          <Dialog.Content className="w-full">
            <Form
              method="post"
              className="w-full space-y-6 rounded-lg bg-white p-6 sm:w-[480px] sm:p-8"
            >
              <H2>Add New Board</H2>
              <TextInput
                label="Board Name"
                name="name"
                placeholder="e.g. Web Design"
              />

              <MultiInputs
                name="columns"
                label="Board Columns"
                placeholder="e.g. Todo"
                cta="Add New Column"
              />

              <Button
                variant="primary"
                size="sm"
                name="_action"
                value="new-board"
              >
                Create New Board
              </Button>
            </Form>
          </Dialog.Content>
        </div>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export { NewBoard };
