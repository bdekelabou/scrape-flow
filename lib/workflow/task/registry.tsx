import { LaunchBrowserTask } from "@/lib/workflow/task/LaunchBrowser";
import { pageToHtmlTask } from "./PageToHtml";

export const TaskRegistry = {
    LAUNCH_BROWSER: LaunchBrowserTask,
    PAGE_TO_HTML: pageToHtmlTask,
} ;   