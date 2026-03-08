import Fastify from 'fastify';
import helmet from '@fastify/helmet';
import cors from '@fastify/cors';
import fastifyJwt from '@fastify/jwt';
import pool from './config/db.js';
import { registerUser, loginUser } from './controllers/authController.js';

const fastify = Fastify({
  logger: true 
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

export default fastify;