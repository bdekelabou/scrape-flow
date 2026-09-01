import { ExecutionContext } from "@/types/execution";

export async function ReadPropertyFromJsonExecutor(
  environment: ExecutionContext["environment"],
  log: ExecutionContext["log"],
  node: ExecutionContext["node"]
): Promise<boolean> {
  try {
    const jsonStr = environment.phases[node.id]?.inputs["JSON"];
    const propName = environment.phases[node.id]?.inputs["Property name"];
    log(`Reading property ${propName} from JSON`, "info");

    let val = "";
    if (jsonStr && propName) {
      const parsed = JSON.parse(jsonStr);
      val = parsed[propName] !== undefined ? String(parsed[propName]) : "";
    }

    environment.phases[node.id] = {
      inputs: { JSON: jsonStr || "", "Property name": propName || "" },
      outputs: { "Property value": val },
    };

    log(`Read property value: ${val}`, "info");
    return true;
  } catch (error: any) {
    log(`Failed reading JSON property: ${error.message}`, "error");
    return false;
  }
}
