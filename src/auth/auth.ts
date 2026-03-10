import fastifyJwt from "@fastify/jwt";
import type {
    FastifyInstance, FastifyPluginOptions, FastifyReply, FastifyRequest,
} from "fastify";

import fastifyPlugin from "fastify-plugin";
import getPublicKey from "./jwks";
import type { TokenPayload } from "../types/auth";
import { httpError } from "./errors/httpError";

// Vi modifierar den inbyggda typen FastifyInstance så att TS vet om att
// jag har en funktion som heter authenticate på FastifyInstance.
declare module "fastify" {
    interface FastifyInstance {
        authenticate(request: FastifyRequest, reply: FastifyReply): Promise<void>;
        adminAuthenticate(
            request: FastifyRequest,
            reply: FastifyReply
        ): Promise<void>;
    }
}



export async function authenticate(
    request: FastifyRequest,
    reply: FastifyReply
) {
    try {
        await request.jwtVerify();
    } catch (error) {
        throw httpError(401, "You are not authorized")
    }
}

async function auth(
    fastifyServer: FastifyInstance,
    options: FastifyPluginOptions
) {

    await fastifyServer.register(fastifyJwt, {
        secret: getPublicKey,
        decode: { complete: true },
    });

    fastifyServer.decorate("authenticate", authenticate)

    fastifyServer.adminAuthenticate
    fastifyServer.decorate(
        "adminAuthenticate",
        async (request: FastifyRequest, reply: FastifyReply) => {
            try {
                const decodedToken = await request.jwtVerify<TokenPayload>();
                const isAdmin = decodedToken.role?.includes("admin")
                if (!isAdmin) {
                    throw httpError(403, "Admin access required")
                }
            } catch (error: any) {
                if (error?.statusCode) throw error

            }
        }
    );
}

export default fastifyPlugin(auth);