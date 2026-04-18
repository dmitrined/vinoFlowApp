import { SignJWT, jwtVerify } from "jose";

// Using a fallback for type safety, but the real key is in .env or .env.local
/**
 * ВНИМАНИЕ: В production-окружении (Vercel/Docker) переменная среды JWT_SECRET
 * должна быть строго задана. Использование fallback-ключа допустимо только локально.
 */
const secretKey = process.env.JWT_SECRET || "fallback_super_secret_for_dev_only";
const key = new TextEncoder().encode(secretKey);

export async function signAuthToken(): Promise<string> {
  return await new SignJWT({ role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("30d") // Login lasts 30 days
    .sign(key);
}

export async function verifyAuthToken(token: string | undefined): Promise<boolean> {
  if (!token) return false;
  
  try {
    const { payload } = await jwtVerify(token, key);
    // As long as the signature is valid and hasn't expired, we accept it.
    // We only have one role/user right now.
    return payload?.role === "admin";
  } catch {
    return false;
  }
}
