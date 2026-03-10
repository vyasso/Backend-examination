import Fastify from 'fastify';
import rateLimit from '@fastify/rate-limit';
import cookie from '@fastify/cookie';
import helmet from '@fastify/helmet';
import cors from '@fastify/cors';
import fastifyJwt from '@fastify/jwt';
import pool from './config/db.js';
import { registerUser, loginUser } from './controllers/authController.js';

const fastify = Fastify({
  logger: true
});
// Rate limiting
const app = Fastify();

// Registrera rate limit plugin
await app.register(rateLimit, {
  max: 100,             // Max 100 anrop...
  timeWindow: '1 minute', // ...per minut
  errorResponseBuilder: (request, context) => {
    return {
      statusCode: 429,
      error: 'Too Many Requests',
      message: `Du har gjort för många anrop. Försök igen om ${context.after}.`
    };
  }
});


// Säkerhet
await fastify.register(helmet);
await fastify.register(cors);

// JWT setup
fastify.register(fastifyJwt, {
  secret: process.env.JWT_SECRET || 'super-secret-key'
});

// Health check
fastify.get('/api/health', async (request, reply) => {
  try {
    const dbCheck = await pool.query('SELECT NOW()');
    return { status: 'success', db: 'OK', time: dbCheck.rows[0].now };
  } catch (err) {
    reply.status(500).send({ error: 'DB-fel' });
  }
});

// Auth routes
fastify.post('/api/auth/register', registerUser);
fastify.post('/api/auth/login', loginUser);

// Start
const start = async () => {
  try {
    await fastify.listen({ port: 3000, host: '0.0.0.0' });
    console.log('🚀 Server körs');
  } catch (err) {
    process.exit(1);
  }
};

start();

// refresh token osv

fastify.register(cookie);
fastify.register(jwt, {
  secret: process.env.JWT_SECRET || 'super-secret-key',
  cookie: {
    cookieName: 'refreshToken',
    signed: false
  }
});

// Middleware för att skydda routes
fastify.decorate("authenticate", async (request, reply) => {
  try {
    await request.jwtVerify(); // Verifierar Access Token i Authorization headern
  } catch (err) {
    reply.send(err);
  }
});

export default fastify;