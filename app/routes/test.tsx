import { CheckboxGroup } from "~/components/checkbox-group";

export default function Test() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-[400px]">
        <CheckboxGroup
          options={[
            { title: "Option 1", isCompleted: false },
            { title: "Option 2", isCompleted: true },
            { title: "Option 3", isCompleted: false },
          ]}
          label="Subtask Checkbox"
        />
      </div>
    </div>
  );
}
