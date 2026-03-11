import Fastify from 'fastify';
import helmet from '@fastify/helmet';
import cors from '@fastify/cors';
import rateLimit from '@fastify/rate-limit';
import fastifyJwt from '@fastify/jwt';
import pool from './config/db.js';

// Controllers
import { registerUser, loginUser, refreshTokenUser } from './controllers/authController.js';
import { create, getAll, update, remove } from './controllers/eventController.js';
import { bookEvent, getMyEvents, cancelBooking } from './controllers/registrationController.js';

// Middleware & Validering
import { authenticate, isAdmin } from './middleware/auth.js';
import { registerSchema, createEventSchema } from './schemas/validation.js';

const fastify = Fastify({ logger: true });

// Säkerhet
await fastify.register(helmet);
await fastify.register(cors);
await fastify.register(rateLimit, {
  max: 100, // Max 100 anrop
  timeWindow: '1 minute' // per minut per IP
});

// JWT
fastify.register(fastifyJwt, {
  secret: process.env.JWT_SECRET || 'super-secret-key'
});

// DB-koll
fastify.get('/api/health', async (request, reply) => {
  try {
    const dbCheck = await pool.query('SELECT NOW()');
    return { status: 'success', db: 'OK', time: dbCheck.rows[0].now };
  } catch (err) {
    reply.status(500).send({ error: 'DB-fel' });
  }
});

// Användare (Resurs 1)
fastify.post('/api/auth/register', registerSchema, registerUser);
fastify.post('/api/auth/login', loginUser);
fastify.post('/api/auth/refresh', refreshTokenUser); // Ny route för att förnya token

// Events (Resurs 2) - Validering + Admin-krav på POST/PUT
fastify.get('/api/events', getAll);
fastify.post('/api/events', { schema: createEventSchema.schema, preHandler: [authenticate, isAdmin] }, create);
fastify.put('/api/events/:id', { schema: createEventSchema.schema, preHandler: [authenticate, isAdmin] }, update);
fastify.delete('/api/events/:id', { preHandler: [authenticate, isAdmin] }, remove);

// Bokningar (Resurs 3) - Inloggning krävs
fastify.post('/api/registrations', { preHandler: [authenticate] }, bookEvent);
fastify.get('/api/users/me/registrations', { preHandler: [authenticate] }, getMyEvents);
fastify.delete('/api/registrations', { preHandler: [authenticate] }, cancelBooking);

// Global felhanterare (fastify inbyggda)
fastify.setErrorHandler((error, request, reply) => {
  fastify.log.error(error); // Loggar felet

  const statusCode = error.statusCode || 500;
  
  reply.status(statusCode).send({
    success: false,
    statusCode: statusCode,
    error: statusCode === 500 ? 'Ett internt serverfel uppstod' : error.message
  });
});

// Starta server
const start = async () => {
  try {
    await fastify.listen({ port: 3000, host: '0.0.0.0' });
    console.log('🚀 Server körs');
  } catch (err) {
    process.exit(1);
  }
};

start();

export default fastify;