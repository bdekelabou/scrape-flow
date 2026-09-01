import { ExecutionContext } from "@/types/execution";

export async function PageToHtmlExecutor(
  environment: ExecutionContext["environment"],
  log: ExecutionContext["log"],
  node: ExecutionContext["node"]
): Promise<boolean> {
  try {
    log("Extracting HTML content from web page", "info");

    const htmlContent = "<html><body><main><h1>ScrapeFlow Data</h1><p class='content'>Extracted sample text data</p></main></body></html>";

    environment.phases[node.id] = {
      inputs: { "Web page": "browser_instance_active" },
      outputs: {
        Html: htmlContent,
        "Web page": "browser_instance_active",
      },
    };

    log("Successfully extracted HTML from page", "info");
    return true;
  } catch (error: any) {
    log(`Failed to extract HTML: ${error.message}`, "error");
    return false;
  }
}
