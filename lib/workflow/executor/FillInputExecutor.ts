import { ExecutionEnvironment } from "@/types/execution";
import { LogLevel } from "@/types/log";

export async function FillInputExecutor(
  environment: ExecutionEnvironment,
  log: (msg: string, level?: LogLevel) => void,
  node: any
): Promise<boolean> {
  try {
    const selector = environment.phases[node.id]?.inputs["Selector"];
    const value = environment.phases[node.id]?.inputs["Value"];

    if (!selector) {
      log("Selector is required", "error");
      return false;
    }
    if (!value) {
      log("Value is required", "error");
      return false;
    }

    const page = environment.page;
    if (!page) {
      log("No page found in execution environment", "error");
      return false;
    }

    log(`Filling input element "${selector}" with value: "${value}"`, "info");

    await page.waitForSelector(selector, { timeout: 10000 });
    await page.type(selector, value);

    environment.phases[node.id].outputs = { "Web page": "browser_instance_active" };

    log(`Successfully filled input "${selector}"`, "info");
    return true;
  } catch (error: any) {
    log(`Failed to fill input: ${error.message}`, "error");
    return false;
  }
}

