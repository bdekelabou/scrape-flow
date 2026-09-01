import { TaskType } from "@/types/task";
import { ExecutionContext } from "@/types/execution";
import { LaunchBrowserExecutor } from "./LaunchBrowserExecutor";
import { PageToHtmlExecutor } from "./PageToHtmlExecutor";
import { ExtractTextFromElementExecutor } from "./ExtractTextFromElementExecutor";
import { FillInputExecutor } from "./FillInputExecutor";
import { ClickElementExecutor } from "./ClickElementExecutor";
import { WaitForElementExecutor } from "./WaitForElementExecutor";
import { DeliverViaWebhookExecutor } from "./DeliverViaWebhookExecutor";
import { ExtractDataWithAiExecutor } from "./ExtractDataWithAiExecutor";
import { ReadPropertyFromJsonExecutor } from "./ReadPropertyFromJsonExecutor";
import { AddPropertyToJsonExecutor } from "./AddPropertyToJsonExecutor";
import { NavigateToUrlExecutor } from "./NavigateToUrlExecutor";
import { ScrollToElementExecutor } from "./ScrollToElementExecutor";

type ExecutorFn = (
  environment: ExecutionContext["environment"],
  log: ExecutionContext["log"],
  node: ExecutionContext["node"]
) => Promise<boolean>;

export const ExecutorRegistry: Record<TaskType, ExecutorFn> = {
  [TaskType.LAUNCH_BROWSER]: LaunchBrowserExecutor,
  [TaskType.PAGE_TO_HTML]: PageToHtmlExecutor,
  [TaskType.EXTRACT_TEXT_FROM_ELEMENT]: ExtractTextFromElementExecutor,
  [TaskType.FILL_INPUT]: FillInputExecutor,
  [TaskType.CLICK_ELEMENT]: ClickElementExecutor,
  [TaskType.WAIT_FOR_ELEMENT]: WaitForElementExecutor,
  [TaskType.DELIVER_VIA_WEBHOOK]: DeliverViaWebhookExecutor,
  [TaskType.EXTRACT_DATA_WITH_AI]: ExtractDataWithAiExecutor,
  [TaskType.READ_PROPERTY_FROM_JSON]: ReadPropertyFromJsonExecutor,
  [TaskType.ADD_PROPERTY_TO_JSON]: AddPropertyToJsonExecutor,
  [TaskType.NAVIGATE_TO_URL]: NavigateToUrlExecutor,
  [TaskType.SCROLL_TO_ELEMENT]: ScrollToElementExecutor,
};
