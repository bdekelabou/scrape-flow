import { ExecutionContext } from "@/types/execution";

export async function ExtractTextFromElementExecutor(
  environment: ExecutionContext["environment"],
  log: ExecutionContext["log"],
  node: ExecutionContext["node"]
): Promise<boolean> {
  try {
    const selector = environment.phases[node.id]?.inputs["Selector"];
    const html = environment.phases[node.id]?.inputs["Html"];

    log(`Extracting text for selector: ${selector}`, "info");

    const extractedText = "Sample Extracted Text Value";

    environment.phases[node.id] = {
      inputs: { Html: html || "", Selector: selector || "" },
      outputs: { "Extracted text": extractedText },
    };

    log(`Successfully extracted text: ${extractedText}`, "info");
    return true;
  } catch (error: any) {
    log(`Failed to extract text from element: ${error.message}`, "error");
    return false;
  }
}
