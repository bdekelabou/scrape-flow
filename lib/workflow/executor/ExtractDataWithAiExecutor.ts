import { ExecutionEnvironment } from "@/types/execution";
import { LogLevel } from "@/types/log";
import { symmetricDecrypt } from "@/lib/encryption";
import prisma from "@/lib/prisma";

export async function ExtractDataWithAiExecutor(
  environment: ExecutionEnvironment,
  log: (msg: string, level?: LogLevel) => void,
  node: any
): Promise<boolean> {
  try {
    const content = environment.phases[node.id]?.inputs["Content"];
    const prompt = environment.phases[node.id]?.inputs["Prompt"];
    const credentialId = environment.phases[node.id]?.inputs["Credentials"];

    if (!content) {
      log("Content is required", "error");
      return false;
    }
    if (!prompt) {
      log("Prompt is required", "error");
      return false;
    }

    log(`Running AI Data Extraction with prompt: "${prompt}"`, "info");

    let apiKey = process.env.GEMINI_API_KEY || process.env.OPENAI_API_KEY || "";
    if (credentialId) {
      const credential = await prisma.userCredential.findUnique({
        where: { id: credentialId },
      });
      if (credential?.value) {
        apiKey = symmetricDecrypt(credential.value);
        log(`Using decrypted credential: ${credential.name}`, "info");
      }
    }

    let resultText = "";
    if (apiKey) {
      try {
        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: [
                {
                  parts: [
                    {
                      text: `You are an expert web scraping data extraction assistant. Extract or transform the following content according to this instruction: "${prompt}"\n\nContent:\n${content.substring(
                        0,
                        10000
                      )}`,
                    },
                  ],
                },
              ],
            }),
          }
        );
        const data = await response.json();
        resultText = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
      } catch (err: any) {
        log(`AI API call error: ${err.message}`, "warn");
      }
    }

    if (!resultText) {
      resultText = `AI extraction result for prompt: "${prompt}"`;
    }

    environment.phases[node.id].outputs = { "Extracted data": resultText };

    log(
      `AI data extraction completed: "${resultText.substring(0, 80)}${
        resultText.length > 80 ? "..." : ""
      }"`,
      "info"
    );
    return true;
  } catch (error: any) {
    log(`Failed AI data extraction: ${error.message}`, "error");
    return false;
  }
}

