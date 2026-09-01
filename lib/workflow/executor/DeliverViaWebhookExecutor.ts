import { ExecutionEnvironment } from "@/types/execution";
import { LogLevel } from "@/types/log";

export async function DeliverViaWebhookExecutor(
  environment: ExecutionEnvironment,
  log: (msg: string, level?: LogLevel) => void,
  node: any
): Promise<boolean> {
  try {
    const targetUrl = environment.phases[node.id]?.inputs["Target URL"];
    const body = environment.phases[node.id]?.inputs["Body"];

    if (!targetUrl) {
      log("Target URL is required", "error");
      return false;
    }
    if (!body) {
      log("Body is required", "error");
      return false;
    }

    log(`Delivering payload to webhook: ${targetUrl}`, "info");

    let parsedBody: any;
    try {
      parsedBody = JSON.parse(body);
    } catch {
      parsedBody = { data: body };
    }

    const response = await fetch(targetUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(parsedBody),
    });

    if (!response.ok) {
      log(
        `Webhook delivery failed with HTTP ${response.status}: ${response.statusText}`,
        "error"
      );
      return false;
    }

    environment.phases[node.id].outputs = {};

    log(
      `Successfully delivered payload to webhook (HTTP ${response.status})`,
      "info"
    );
    return true;
  } catch (error: any) {
    log(`Failed to deliver webhook: ${error.message}`, "error");
    return false;
  }
}

