import { jwtDecode } from "jwt-decode";


export function decrypt(session: string | undefined = "") {
  try {
    const  payload  =  jwtDecode(session);

    return payload;
  } catch (error) {
    console.log("Failed to verify session");
    return null
  }
}

export function isJwtExpired(token: string): boolean {
  try {
    const payload = JSON.parse(atob(token.split(".")[1])); // Decode the payload
    if (!payload.exp) return false; // If no `exp` field, assume it's not expired
    const expiryTime = payload.exp  * 1000 // Convert to milliseconds
    return Date.now() >= expiryTime;
  } catch (error) {
    console.error("Invalid JWT token", error);
    return true; // Treat invalid tokens as expired
  }
}
