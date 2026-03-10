import type { FastifyRequest } from "fastify";
import JwksClient from "jwks-rsa";

const AUTH0_JWKS_URI = process.env.AUTH0_JWKS_URI;

if (!AUTH0_JWKS_URI) throw new Error("Please provide jwks uri");

const client = JwksClient({
    jwksUri: AUTH0_JWKS_URI,
});

const getPublicKey = async (
    _request: FastifyRequest,
    decodedToken: any
): Promise<string> => {
    const kid: string | null = decodedToken.header
        ? decodedToken.header.kid
        : decodedToken.kid;

    const signingKey = await client.getSigningKey(kid);

    const publicKey = signingKey.getPublicKey();

    return publicKey;
};

export default getPublicKey;