import { ExecutionEnvironment } from "@/types/execution";
import { LogLevel } from "@/types/log";

export async function PageToHtmlExecutor(
  environment: ExecutionEnvironment,
  log: (msg: string, level?: LogLevel) => void,
  node: any
): Promise<boolean> {
  try {
    log("Getting HTML from page", "info");

    const page = environment.page;
    if (!page) {
      log("No page available in environment", "error");
      return false;
    }

    const html = await page.content();
    environment.phases[node.id].outputs = { Html: html };

    log(`Got HTML from page (${html.length} characters)`, "info");
    return true;
  } catch (error: any) {
    log(`Failed to get HTML from page: ${error.message}`, "error");
    return false;
  }
}
