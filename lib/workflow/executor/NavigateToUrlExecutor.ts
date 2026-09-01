import { ExecutionContext } from "@/types/execution";

export async function NavigateToUrlExecutor(
  environment: ExecutionContext["environment"],
  log: ExecutionContext["log"],
  node: ExecutionContext["node"]
): Promise<boolean> {
  try {
    const url = environment.phases[node.id]?.inputs["URL"];
    log(`Navigating to URL: ${url}`, "info");

    environment.phases[node.id] = {
      inputs: { "Web page": "browser_instance_active", URL: url || "" },
      outputs: { "Web page": "browser_instance_active" },
    };

    log(`Successfully navigated to ${url}`, "info");
    return true;
  } catch (error: any) {
    log(`Failed navigating to URL: ${error.message}`, "error");
    return false;
  }
}
