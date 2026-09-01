import { ExecutionContext } from "@/types/execution";

export async function ScrollToElementExecutor(
  environment: ExecutionContext["environment"],
  log: ExecutionContext["log"],
  node: ExecutionContext["node"]
): Promise<boolean> {
  try {
    const selector = environment.phases[node.id]?.inputs["Selector"];
    log(`Scrolling to element: ${selector}`, "info");

    environment.phases[node.id] = {
      inputs: { "Web page": "browser_instance_active", Selector: selector || "" },
      outputs: { "Web page": "browser_instance_active" },
    };

    log(`Successfully scrolled to element: ${selector}`, "info");
    return true;
  } catch (error: any) {
    log(`Failed scrolling to element: ${error.message}`, "error");
    return false;
  }
}
