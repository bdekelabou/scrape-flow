import { ExecutionContext } from "@/types/execution";

export async function AddPropertyToJsonExecutor(
  environment: ExecutionContext["environment"],
  log: ExecutionContext["log"],
  node: ExecutionContext["node"]
): Promise<boolean> {
  try {
    const jsonStr = environment.phases[node.id]?.inputs["JSON"];
    const propName = environment.phases[node.id]?.inputs["Property name"];
    const propVal = environment.phases[node.id]?.inputs["Property value"];
    log(`Adding property ${propName} to JSON`, "info");

    let parsed = {};
    if (jsonStr) {
      try { parsed = JSON.parse(jsonStr); } catch (e) {}
    }
    if (propName) {
      (parsed as any)[propName] = propVal;
    }
    const updated = JSON.stringify(parsed);

    environment.phases[node.id] = {
      inputs: { JSON: jsonStr || "", "Property name": propName || "", "Property value": propVal || "" },
      outputs: { "Updated JSON": updated },
    };

    log("Successfully added property to JSON", "info");
    return true;
  } catch (error: any) {
    log(`Failed adding property to JSON: ${error.message}`, "error");
    return false;
  }
}
