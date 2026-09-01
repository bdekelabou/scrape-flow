import { ExecutionContext } from "@/types/execution";

export async function WaitForElementExecutor(
  environment: ExecutionContext["environment"],
  log: ExecutionContext["log"],
  node: ExecutionContext["node"]
): Promise<boolean> {
  try {
    const selector = environment.phases[node.id]?.inputs["Selector"];
    const visibility = environment.phases[node.id]?.inputs["Visibility"];
    log(`Waiting for element ${selector} to be ${visibility}`, "info");

    environment.phases[node.id] = {
      inputs: { "Web page": "browser_instance_active", Selector: selector || "", Visibility: visibility || "" },
      outputs: { "Web page": "browser_instance_active" },
    };

    log(`Element ${selector} is ${visibility}`, "info");
    return true;
  } catch (error: any) {
    log(`Failed waiting for element: ${error.message}`, "error");
    return false;
  }
}
