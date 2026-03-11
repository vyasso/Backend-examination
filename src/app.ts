import Fastify, { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import helmet from '@fastify/helmet';
import cors from '@fastify/cors';
import rateLimit from '@fastify/rate-limit';
import fastifyJwt from '@fastify/jwt';
import pool from './config/db';

// Controllers
import { registerUser, loginUser, refreshTokenUser } from './controllers/authController';
import { create, getAll, update, remove } from './controllers/eventController';
import { bookEvent, getMyEvents, cancelBooking } from './controllers/registrationController';

// Middleware & Validering
import { authenticate, isAdmin } from './middleware/auth';
import { registerSchema, createEventSchema } from './schemas/validation';

const fastify: FastifyInstance = Fastify({ logger: true });

// Säkerhet
await fastify.register(helmet);
await fastify.register(cors);
await fastify.register(rateLimit, {
  max: 100,
  timeWindow: '1 minute'
});

// JWT setup
if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET måste definieras i .env');
}
fastify.register(fastifyJwt, {
  secret: process.env.JWT_SECRET
});

// Hälsa
fastify.get('/api/health', async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const dbCheck = await pool.query('SELECT NOW()');
    return { status: 'success', db: 'OK', time: dbCheck.rows[0].now };
  } catch (err) {
    reply.status(500).send({ error: 'DB-fel' });
  }
});

// Användare
fastify.post('/api/auth/register', registerSchema, registerUser);
fastify.post('/api/auth/login', loginUser);
fastify.post('/api/auth/refresh', refreshTokenUser);

// Events
fastify.get('/api/events', getAll);
fastify.post('/api/events', { schema: createEventSchema.schema, preHandler: [authenticate, isAdmin] }, create);
fastify.put('/api/events/:id', { schema: createEventSchema.schema, preHandler: [authenticate, isAdmin] }, update);
fastify.delete('/api/events/:id', { preHandler: [authenticate, isAdmin] }, remove);

// Bokningar
fastify.post('/api/registrations', { preHandler: [authenticate] }, bookEvent);
fastify.get('/api/users/me/registrations', { preHandler: [authenticate] }, getMyEvents);
fastify.delete('/api/registrations', { preHandler: [authenticate] }, cancelBooking);

// Felhantering
fastify.setErrorHandler((error, request, reply) => {
  fastify.log.error(error);
  const statusCode = error.statusCode || 500;
  reply.status(statusCode).send({
    success: false,
    statusCode: statusCode,
    error: statusCode === 500 ? 'Internt serverfel' : error.message
  });
});

// Start
const start = async () => {
  try {
    await fastify.listen({ port: 3000, host: '0.0.0.0' });
    console.log('Server körs på http://localhost:3000');
  } catch (err) {
    process.exit(1);
  }
};

start();

export default fastify;