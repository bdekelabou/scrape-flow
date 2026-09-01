import crypto from "crypto";

const ALG = "aes-256-cbc";

function getKey() {
  const key = process.env.ENCRYPTION_KEY || "scrapeflow-encryption-secret-key-32chars";
  return crypto.createHash("sha256").update(key).digest();
}

export const symmetricEncrypt = (data: string) => {
  const key = getKey();
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(ALG, key, iv);

  let encrypted = cipher.update(data, "utf8");
  encrypted = Buffer.concat([encrypted, cipher.final()]);

  return iv.toString("hex") + ":" + encrypted.toString("hex");
};

export const symmetricDecrypt = (encrypted: string) => {
  if (!encrypted || !encrypted.includes(":")) return encrypted;
  try {
    const key = getKey();
    const [ivHex, encryptedHex] = encrypted.split(":");
    const iv = Buffer.from(ivHex, "hex");
    const encryptedText = Buffer.from(encryptedHex, "hex");

    const decipher = crypto.createDecipheriv(ALG, key, iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);

    return decrypted.toString("utf8");
  } catch (error) {
    return encrypted;
  }
};
