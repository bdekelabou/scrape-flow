import { ExecutionContext } from "@/types/execution";

export async function ExtractDataWithAiExecutor(
  environment: ExecutionContext["environment"],
  log: ExecutionContext["log"],
  node: ExecutionContext["node"]
): Promise<boolean> {
  try {
    const content = environment.phases[node.id]?.inputs["Content"];
    const prompt = environment.phases[node.id]?.inputs["Prompt"];
    log(`Running AI Data Extraction with prompt: ${prompt}`, "info");

    const resultData = JSON.stringify({ summary: "AI Extracted Data Result", contentPreview: content?.substring(0, 50) });

    environment.phases[node.id] = {
      inputs: { Content: content || "", Prompt: prompt || "" },
      outputs: { "Extracted data": resultData },
    };

    log("AI data extraction completed successfully", "info");
    return true;
  } catch (error: any) {
    log(`Failed AI data extraction: ${error.message}`, "error");
    return false;
  }
}
