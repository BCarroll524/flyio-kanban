import {
  CheckIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from "@heroicons/react/24/solid";
import * as Select from "@radix-ui/react-select";
import React from "react";
import useMeasure from "react-use-measure";

const Dropdown = ({
  name,
  label,
  options,
  disabled = false,
  defaultValue,
}: {
  name: string;
  options: string[];
  label: string;
  disabled?: boolean;
  defaultValue?: string;
}) => {
  const [ref, bounds] = useMeasure();

  return (
    <div className="flex flex-col gap-2">
      <label className="font-sans text-sm font-medium text-medium-gray dark:text-white">
        {label}
      </label>
      <Select.Root name={name} defaultValue={defaultValue ?? options[0]}>
        <Select.Trigger
          disabled={disabled}
          ref={ref}
          className="flex items-center rounded-[4px] border border-input px-4 py-2 text-md font-medium leading-md text-black outline-none focus:outline-offset-1 focus:outline-purple-hover dark:text-white"
        >
          <Select.Value />
          {!disabled ? (
            <Select.Icon className="ml-auto flex-shrink-0">
              <ChevronDownIcon className="h-4 w-4 stroke-purple" />
            </Select.Icon>
          ) : null}
        </Select.Trigger>
        <Select.Portal>
          <Select.Content
            sideOffset={12}
            position="popper"
            style={{ width: bounds.width }}
            className={`rounded-[4px] border border-input bg-white px-1 shadow-md dark:bg-dark-bg`}
          >
            <Select.ScrollUpButton>
              <ChevronUpIcon className="h-4 w-4 stroke-purple" />
            </Select.ScrollUpButton>
            <Select.Viewport>
              <Select.Group>
                {options.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </Select.Group>
            </Select.Viewport>
            <Select.ScrollDownButton>
              <ChevronDownIcon />
            </Select.ScrollDownButton>
          </Select.Content>
        </Select.Portal>
      </Select.Root>
    </div>
  );
};

const SelectItem = ({
  value,
  children,
}: {
  value: string;
  children: React.ReactNode;
}) => {
  return (
    <Select.Item
      value={value}
      className="my-1 flex w-full cursor-pointer items-center rounded-[4px] border-none px-3 py-2 text-md font-medium leading-md text-black outline-none hover:bg-light-lines dark:text-medium-gray"
    >
      <Select.ItemText>{children}</Select.ItemText>
      <Select.ItemIndicator className="ml-auto">
        <CheckIcon className="h-4 w-4 stroke-purple" />
      </Select.ItemIndicator>
    </Select.Item>
  );
};

export { Dropdown };
