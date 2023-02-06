import { CheckIcon } from "@heroicons/react/24/solid";
import * as Checkbox from "@radix-ui/react-checkbox";
import { useFetcher } from "@remix-run/react";
import clsx from "clsx";
import { useRef, useState } from "react";

const CheckboxItem = ({
  id,
  title,
  completed,
}: {
  id: string;
  title: string;
  completed: boolean;
}) => {
  const [checked, setChecked] = useState(completed);
  const fetcher = useFetcher();
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <fetcher.Form
      ref={formRef}
      method="post"
      className="flex items-center gap-4 rounded-[4px] bg-light-bg p-3 hover:bg-purple-hover dark:bg-dark-bg"
    >
      <input type="hidden" name="subtaskId" value={id} />
      <input type="hidden" name="_action" value="complete-subtask" />
      <Checkbox.Root
        name="completed"
        className="flex h-5 w-5 cursor-pointer items-center justify-center rounded-sm data-[state=unchecked]:border  data-[state=unchecked]:border-light-lines data-[state=checked]:bg-purple data-[state=unchecked]:bg-white dark:data-[state=unchecked]:bg-dark-gray"
        defaultChecked={completed}
        onCheckedChange={(val: boolean) => {
          setChecked(val);
          fetcher.submit(formRef.current, {
            method: "post",
          });
        }}
        id={title}
      >
        <Checkbox.Indicator>
          <CheckIcon className="h-4 w-4 fill-white stroke-white stroke-2" />
        </Checkbox.Indicator>
      </Checkbox.Root>
      <label
        className={clsx(
          "flex-1 cursor-pointer select-none font-sans text-sm font-bold text-black dark:text-white",
          checked ? "text-dark-gray line-through" : ""
        )}
        htmlFor={title}
      >
        {title}
      </label>
    </fetcher.Form>
  );
};

const CheckboxGroup = ({
  label,
  options,
}: {
  label: string;
  options: { id: string; title: string; completed: boolean }[];
}) => {
  return (
    <div className="flex flex-col gap-4">
      <label className="font-sans text-sm font-medium text-medium-gray dark:text-white">
        {label}
      </label>
      <ul className="space-y-2">
        {options.map((option) => (
          <li key={option.title}>
            <CheckboxItem
              id={option.id}
              title={option.title}
              completed={option.completed}
            />
          </li>
        ))}
      </ul>
    </div>
  );
};

export { CheckboxGroup };
