import { ExecutionEnvironment } from "@/types/execution";
import { LogLevel } from "@/types/log";

export async function WaitForElementExecutor(
  environment: ExecutionEnvironment,
  log: (msg: string, level?: LogLevel) => void,
  node: any
): Promise<boolean> {
  try {
    const selector = environment.phases[node.id]?.inputs["Selector"];
    const visibility = environment.phases[node.id]?.inputs["Visibility"] || "visible";

    if (!selector) {
      log("Selector is required", "error");
      return false;
    }

    const page = environment.page;
    if (!page) {
      log("No page found in execution environment", "error");
      return false;
    }

    log(`Waiting for element "${selector}" to be ${visibility}`, "info");

    await page.waitForSelector(selector, {
      visible: visibility === "visible",
      hidden: visibility === "hidden",
      timeout: 10000,
    });

    environment.phases[node.id].outputs = { "Web page": "browser_instance_active" };

    log(`Element "${selector}" is now ${visibility}`, "info");
    return true;
  } catch (error: any) {
    log(`Failed waiting for element: ${error.message}`, "error");
    return false;
  }
}

