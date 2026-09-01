import { ExecutionEnvironment } from "@/types/execution";
import { LogLevel } from "@/types/log";

export async function ClickElementExecutor(
  environment: ExecutionEnvironment,
  log: (msg: string, level?: LogLevel) => void,
  node: any
): Promise<boolean> {
  try {
    const selector = environment.phases[node.id]?.inputs["Selector"];

    if (!selector) {
      log("Selector is required", "error");
      return false;
    }

    const page = environment.page;
    if (!page) {
      log("No page found in execution environment", "error");
      return false;
    }

    log(`Clicking element: "${selector}"`, "info");

    await page.waitForSelector(selector, { timeout: 10000 });
    await page.click(selector);

    environment.phases[node.id].outputs = { "Web page": "browser_instance_active" };

    log(`Successfully clicked element "${selector}"`, "info");
    return true;
  } catch (error: any) {
    log(`Failed to click element: ${error.message}`, "error");
    return false;
  }
}

