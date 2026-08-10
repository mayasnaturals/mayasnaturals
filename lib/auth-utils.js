import crypto from "crypto";

const SALT = process.env.ADMIN_SALT || "maya_super_salt_2026";
const JWT_SECRET = process.env.ADMIN_JWT_SECRET || "maya_jwt_secret_secure_key";

export function hashPassword(password) {
  // Simple PBKDF2 hash
  return crypto.pbkdf2Sync(password, SALT, 1000, 64, 'sha512').toString('hex');
}

export function verifyPassword(password, hash) {
  const hashVerify = crypto.pbkdf2Sync(password, SALT, 1000, 64, 'sha512').toString('hex');
  return hash === hashVerify;
}

// Very simple custom JWT-like signer
export function signToken(payload) {
  const header = Buffer.from(JSON.stringify({ alg: "HS256", typ: "JWT" })).toString("base64url");
  const body = Buffer.from(JSON.stringify({ ...payload, exp: Date.now() + 24 * 60 * 60 * 1000 })).toString("base64url");
  
  const signature = crypto.createHmac("sha256", JWT_SECRET)
    .update(`${header}.${body}`)
    .digest("base64url");
    
  return `${header}.${body}.${signature}`;
}

export function verifyToken(token) {
  try {
    const [header, body, signature] = token.split(".");
    
    const expectedSignature = crypto.createHmac("sha256", JWT_SECRET)
      .update(`${header}.${body}`)
      .digest("base64url");
      
    if (signature !== expectedSignature) return null;
    
    const payload = JSON.parse(Buffer.from(body, "base64url").toString("utf8"));
    if (Date.now() > payload.exp) return null; // Expired
    
    return payload;
  } catch (error) {
    return null;
  }
}
