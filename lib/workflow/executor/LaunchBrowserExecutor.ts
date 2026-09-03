import { ExecutionEnvironment } from "@/types/execution";
import { LogLevel } from "@/types/log";

export async function LaunchBrowserExecutor(
  environment: ExecutionEnvironment,
  log: (msg: string, level?: LogLevel) => void,
  node: any
): Promise<boolean> {
  try {
    const websiteUrl = environment.phases[node.id]?.inputs["Website Url"];
    if (!websiteUrl) {
      log("Website Url is required", "error");
      return false;
    }
    log(`Launching browser for URL: ${websiteUrl}`, "info");

    const puppeteerModule = await import("puppeteer");
    const p: any =
      typeof puppeteerModule.launch === "function"
        ? puppeteerModule
        : typeof (puppeteerModule as any).default?.launch === "function"
        ? (puppeteerModule as any).default
        : puppeteerModule.default;

    if (!p || typeof p.launch !== "function") {
      log("Puppeteer library could not be loaded", "error");
      return false;
    }

    const browser = await p.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    environment.browser = browser;

    const page = await browser.newPage();
    await page.goto(websiteUrl, { waitUntil: "domcontentloaded" });
    environment.page = page;

    environment.phases[node.id].outputs = { "Web page": websiteUrl };

    log(`Browser launched successfully at ${websiteUrl}`, "info");
    return true;
  } catch (error: any) {
    log(`Failed to launch browser: ${error.message}`, "error");
    return false;
  }
}
