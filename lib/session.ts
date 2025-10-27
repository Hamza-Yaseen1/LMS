import { SignJWT, jwtVerify, type JWTPayload } from "jose";


const secretKey = new TextEncoder().encode(process.env.JWT_SECRET || "dev-secret-change-me");
const issuer = "library-app";


export type SessionPayload = {
sub: string; // member id as string
email: string;
name: string | null;
};

export async function createSession(payload: SessionPayload) {
const token = await new SignJWT(payload as unknown as JWTPayload)
.setProtectedHeader({ alg: "HS256" })
.setIssuedAt()
.setIssuer(issuer)
.setExpirationTime("7d")
.sign(secretKey);
return token;
}


export async function verifySession(token: string) {
const { payload } = await jwtVerify(token, secretKey, { issuer });
return payload as SessionPayload;
}