import { ExecutionEnvironment } from "@/types/execution";
import { LogLevel } from "@/types/log";
import puppeteer from "puppeteer";

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

    const browser = await puppeteer.launch({
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


