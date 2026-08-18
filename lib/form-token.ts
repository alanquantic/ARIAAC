import crypto from "node:crypto";

const MIN_AGE_MS = 3_000;
const MAX_AGE_MS = 2 * 60 * 60 * 1_000;

function sign(value: string, secret: string) {
  return crypto.createHmac("sha256", secret).update(value).digest("hex");
}

export function issueFormToken() {
  const timestamp = Date.now();
  const secret = process.env.FORM_SECRET ?? "";

  if (!secret) {
    return `${timestamp}.unsigned`;
  }

  return `${timestamp}.${sign(String(timestamp), secret)}`;
}

export function verifyFormToken(token: unknown): {
  valid: boolean;
  reason?: string;
} {
  const secret = process.env.FORM_SECRET ?? "";

  // Local and preview environments can keep working until a secret is configured.
  if (!secret) {
    return { valid: true, reason: "FORM_SECRET no configurado" };
  }

  if (typeof token !== "string" || !token.includes(".")) {
    return { valid: false, reason: "token ausente o malformado" };
  }

  const [timestampString, signature] = token.split(".");
  const timestamp = Number(timestampString);

  if (!Number.isFinite(timestamp) || !signature) {
    return { valid: false, reason: "token malformado" };
  }

  const expected = sign(timestampString, secret);
  const actualBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expected);

  if (
    actualBuffer.length !== expectedBuffer.length ||
    !crypto.timingSafeEqual(actualBuffer, expectedBuffer)
  ) {
    return { valid: false, reason: "firma inválida" };
  }

  const age = Date.now() - timestamp;

  if (age < MIN_AGE_MS) {
    return { valid: false, reason: `envío demasiado rápido (${age}ms)` };
  }

  if (age > MAX_AGE_MS) {
    return { valid: false, reason: "token vencido" };
  }

  return { valid: true };
}
