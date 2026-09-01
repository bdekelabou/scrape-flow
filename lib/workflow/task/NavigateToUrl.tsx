import { TaskParamType, TaskType } from "@/types/task";
import { Link2Icon, LucideProps } from "lucide-react";

export const NavigateToUrlTask = {
  type: TaskType.NAVIGATE_TO_URL,
  label: "Navigate to URL",
  icon: (props: LucideProps) => (
    <Link2Icon className="stroke-teal-400" {...props} />
  ),
  isEntryPoint: false,
  credits: 2,
  inputs: [
    {
      name: "Web page",
      type: TaskParamType.BROWSER_INSTANCE,
      required: true,
    },
    {
      name: "URL",
      type: TaskParamType.STRING,
      required: true,
    },
  ],
  outputs: [
    {
      name: "Web page",
      type: TaskParamType.BROWSER_INSTANCE,
    },
  ],
};
