import { ExecutionContext } from "@/types/execution";

export async function DeliverViaWebhookExecutor(
  environment: ExecutionContext["environment"],
  log: ExecutionContext["log"],
  node: ExecutionContext["node"]
): Promise<boolean> {
  try {
    const targetUrl = environment.phases[node.id]?.inputs["Target URL"];
    const body = environment.phases[node.id]?.inputs["Body"];
    log(`Delivering payload to webhook: ${targetUrl}`, "info");

    environment.phases[node.id] = {
      inputs: { "Target URL": targetUrl || "", Body: body || "" },
      outputs: {},
    };

    log(`Successfully delivered payload to ${targetUrl}`, "info");
    return true;
  } catch (error: any) {
    log(`Failed to deliver webhook: ${error.message}`, "error");
    return false;
  }
}
