import crypto from "crypto";

const ALGORITHM = "chacha20-poly1305";

const getKey = () => {
  if (!process.env.ENCRYPTION_KEY || process.env.ENCRYPTION_KEY.length !== 64) {
    throw new Error(
      "CRITICAL: ENCRYPTION_KEY must be exactly 64 hex characters.",
    );
  }
  return Buffer.from(process.env.ENCRYPTION_KEY, "hex");
};

export const encryptText = (text) => {
  if (!text) return text;

  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv(ALGORITHM, getKey(), iv);

  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");

  const authTag = cipher.getAuthTag().toString("hex");

  return `${iv.toString("hex")}:${authTag}:${encrypted}`;
};

export const decryptText = (encryptedBundle) => {
  if (!encryptedBundle || !encryptedBundle.includes(":"))
    return encryptedBundle;

  try {
    const parts = encryptedBundle.split(":");
    const iv = Buffer.from(parts[0], "hex");
    const authTag = Buffer.from(parts[1], "hex");
    const encryptedText = parts[2];

    const decipher = crypto.createDecipheriv(ALGORITHM, getKey(), iv);
    decipher.setAuthTag(authTag);

    let decrypted = decipher.update(encryptedText, "hex", "utf8");
    decrypted += decipher.final("utf8");

    return decrypted;
  } catch (error) {
    console.error(
      "Decryption failed. The data might be corrupted or tampered with.",
    );
    return "Error: Could not decrypt data";
  }
};
