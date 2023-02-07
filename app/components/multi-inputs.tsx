import { XMarkIcon } from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import { Button } from "./button";

const getRandom = () => (Math.random() + 1).toString(36).substring(7);

type InputOption = {
  key: string;
  value: string;
};

// should contain list of items passed in, items passed in deleted and new items added
// items passed in deleted need different onRemove function
// items created new need different onRemove function

function MultiInputs({
  name,
  label,
  placeholder,
  currentInputs,
  cta,
}: {
  name: string;
  label: string;
  placeholder: string;
  currentInputs?: {
    key: string;
    value: string;
  }[];
  cta: string;
}) {
  const [oldInputs, setOldInputs] = useState<InputOption[]>(
    currentInputs ?? []
  );
  const [deletedInputs, setDeletedInputs] = useState<string[]>([]);
  const [newInputs, setNewInputs] = useState<InputOption[]>(
    !currentInputs?.length ? [{ key: getRandom(), value: "" }] : []
  );

  // if has oldInputs => gt 0
  // if no oldInputs => 1

  useEffect(() => {
    const index = newInputs.length - 1;
    let element: HTMLElement | null = null;
    if (currentInputs?.length && newInputs.length) {
      // find element and auto focus
      element = document.getElementById(`new-input-${index}`);
    } else if (!currentInputs?.length && newInputs.length > 1) {
      // find element and auto focus
      element = document.getElementById(`new-input-${index}`);
    }

    if (element) {
      element.focus();
    }
  }, [newInputs.length, currentInputs]);

  return (
    <div className="flex flex-col space-y-3">
      <label
        htmlFor={name}
        className="font-sans text-sm font-medium text-medium-gray dark:text-white"
      >
        {label}
      </label>
      {oldInputs.map((input, index) => (
        <div key={input.key} className="flex items-center gap-2">
          <input
            type="text"
            name={name}
            id={name}
            onChange={(e) => {
              setOldInputs((prev) =>
                prev.map((item, i) => {
                  if (i === index) {
                    return { ...item, value: e.target.value };
                  }
                  return item;
                })
              );
            }}
            value={input.value}
            placeholder={placeholder}
            className="flex-1 rounded-[4px] border border-input px-4 py-2 text-md font-medium leading-md text-black placeholder:text-input focus:outline-none focus:ring-2 focus:ring-purple-hover focus:ring-offset-1  dark:placeholder:text-dark-lines"
          />
          <button
            type="button"
            tabIndex={-1}
            onClick={() => {
              setOldInputs((prev) => prev.filter((_, i) => i !== index));
              setDeletedInputs((prev) => [...prev, input.key]);
            }}
            className="rounded-full outline-offset-2 outline-purple-hover"
          >
            <XMarkIcon className="h-6 w-6 stroke-2 text-medium-gray" />
          </button>
        </div>
      ))}

      {newInputs.map((input, index) => (
        <div key={input.key} className="flex items-center gap-2">
          <input
            type="text"
            name={name}
            id={`new-input-${index}`}
            onChange={(e) => {
              setNewInputs((prev) =>
                prev.map((item, i) => {
                  if (i === index) {
                    return { ...item, value: e.target.value };
                  }
                  return item;
                })
              );
            }}
            value={input.value}
            placeholder={placeholder}
            className="flex-1 rounded-[4px] border border-input px-4 py-2 text-md font-medium leading-md text-black placeholder:text-input focus:outline-none focus:ring-2 focus:ring-purple-hover focus:ring-offset-1  dark:placeholder:text-dark-lines"
          />
          <button
            type="button"
            tabIndex={-1}
            onClick={() => {
              setNewInputs((prev) => prev.filter((_, i) => i !== index));
            }}
            className="rounded-full outline-offset-2 outline-purple-hover"
          >
            <XMarkIcon className="h-6 w-6 stroke-2 text-medium-gray" />
          </button>
        </div>
      ))}

      <input type="hidden" name={`deleted-${name}`} value={deletedInputs} />
      <input
        type="hidden"
        name={`new-${name}`}
        value={JSON.stringify(newInputs.filter((i) => i.value))}
      />
      <input
        type="hidden"
        name={`old-${name}`}
        value={JSON.stringify(oldInputs)}
      />

      <Button
        type="button"
        variant="secondary"
        size="sm"
        onClick={() => {
          const elements = document.getElementById("new-input");
          console.log(elements);
          setNewInputs((prev) => [...prev, { key: getRandom(), value: "" }]);
        }}
      >
        {cta}
      </Button>
    </div>
  );
}

export { MultiInputs };
