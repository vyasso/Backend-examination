
import type { FastifyInstance } from 'fastify';

export default async function authRoutes(fastify: FastifyInstance) {

    fastify.post('/login', {
        config: {
            rateLimit: {
                max: 5,               // Max 5 försök...
                timeWindow: '5 minutes' // ...per 5 minuter per IP
            }
        }
    }, async (request, reply) => {
        // Din login-logik här...
    });
}