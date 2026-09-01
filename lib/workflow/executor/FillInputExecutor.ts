import { ExecutionContext } from "@/types/execution";

export async function FillInputExecutor(
  environment: ExecutionContext["environment"],
  log: ExecutionContext["log"],
  node: ExecutionContext["node"]
): Promise<boolean> {
  try {
    const selector = environment.phases[node.id]?.inputs["Selector"];
    const value = environment.phases[node.id]?.inputs["Value"];

    log(`Filling input ${selector} with value ${value}`, "info");

    environment.phases[node.id] = {
      inputs: { "Web page": "browser_instance_active", Selector: selector || "", Value: value || "" },
      outputs: { "Web page": "browser_instance_active" },
    };

    log(`Successfully filled input ${selector}`, "info");
    return true;
  } catch (error: any) {
    log(`Failed to fill input: ${error.message}`, "error");
    return false;
  }
}
