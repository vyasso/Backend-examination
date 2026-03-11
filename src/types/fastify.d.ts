import "@fastify/jwt";

declare module "fastify" {
  interface FastifyInstance {
    jwt: any;
  }
  interface FastifyRequest {
    jwt: any;
  }
}