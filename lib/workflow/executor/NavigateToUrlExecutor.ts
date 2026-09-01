import { ExecutionEnvironment } from "@/types/execution";
import { LogLevel } from "@/types/log";

export async function NavigateToUrlExecutor(
  environment: ExecutionEnvironment,
  log: (msg: string, level?: LogLevel) => void,
  node: any
): Promise<boolean> {
  try {
    const url = environment.phases[node.id]?.inputs["URL"];

    if (!url) {
      log("URL is required", "error");
      return false;
    }

    const page = environment.page;
    if (!page) {
      log("No page found in execution environment", "error");
      return false;
    }

    log(`Navigating to URL: ${url}`, "info");

    await page.goto(url, { waitUntil: "domcontentloaded" });

    environment.phases[node.id].outputs = { "Web page": url };

    log(`Successfully navigated to ${url}`, "info");
    return true;
  } catch (error: any) {
    log(`Failed navigating to URL: ${error.message}`, "error");
    return false;
  }
}

