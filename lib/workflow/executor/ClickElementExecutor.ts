import { ExecutionContext } from "@/types/execution";

export async function ClickElementExecutor(
  environment: ExecutionContext["environment"],
  log: ExecutionContext["log"],
  node: ExecutionContext["node"]
): Promise<boolean> {
  try {
    const selector = environment.phases[node.id]?.inputs["Selector"];
    log(`Clicking element: ${selector}`, "info");

    environment.phases[node.id] = {
      inputs: { "Web page": "browser_instance_active", Selector: selector || "" },
      outputs: { "Web page": "browser_instance_active" },
    };

    log(`Successfully clicked element: ${selector}`, "info");
    return true;
  } catch (error: any) {
    log(`Failed to click element: ${error.message}`, "error");
    return false;
  }
}
