import { ExecutionEnvironment } from "@/types/execution";
import { LogLevel } from "@/types/log";
import * as cheerio from "cheerio";

export async function ExtractTextFromElementExecutor(
  environment: ExecutionEnvironment,
  log: (msg: string, level?: LogLevel) => void,
  node: any
): Promise<boolean> {
  try {
    const selector = environment.phases[node.id]?.inputs["Selector"];
    const html = environment.phases[node.id]?.inputs["Html"];

    if (!selector) {
      log("Selector is required", "error");
      return false;
    }
    if (!html) {
      log("Html content is required", "error");
      return false;
    }

    log(`Extracting text for selector: "${selector}"`, "info");

    const $ = cheerio.load(html);
    const element = $(selector);

    if (element.length === 0) {
      log(`No element found with selector: "${selector}"`, "error");
      return false;
    }

    const extractedText = element.first().text().trim();
    if (!extractedText) {
      log(`Element found but has empty text content`, "warn");
    }

    environment.phases[node.id].outputs = { "Extracted text": extractedText };

    log(
      `Successfully extracted text: "${extractedText.substring(0, 80)}${
        extractedText.length > 80 ? "..." : ""
      }"`,
      "info"
    );
    return true;
  } catch (error: any) {
    log(`Failed to extract text from element: ${error.message}`, "error");
    return false;
  }
}

