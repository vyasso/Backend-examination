import bcrypt from 'bcrypt';
import { FastifyRequest, FastifyReply } from 'fastify';
import * as userRepository from '../repositories/userRepository';

// Registrering
export const registerUser = async (request: FastifyRequest, reply: FastifyReply) => {
  const body = request.body as any;
  const hash = await bcrypt.hash(body.password, 10);
  const user = await userRepository.createUser(body.email, hash);
  return reply.status(201).send({ message: 'Skapad', user });
};

// Inloggning
export const loginUser = async function (this: any, request: FastifyRequest, reply: FastifyReply) {
  const body = request.body as any;

  const user = await userRepository.findUserByEmail(body.email);
  if (!user) return reply.status(401).send({ error: 'Fel info' });

  const isMatch = await bcrypt.compare(body.password, user.password_hash);
  if (!isMatch) return reply.status(401).send({ error: 'Fel info' });

  // Access Token
  const accessToken = this.jwt.sign(
    { id: user.id, role: user.role },
    { expiresIn: '15m' }
  );

  // Refresh Token
  const refreshToken = this.jwt.sign(
    { id: user.id },
    { expiresIn: '7d' }
  );

  return reply.send({ accessToken, refreshToken });
};

// Refresh
export const refreshTokenUser = async function (request: FastifyRequest, reply: FastifyReply) {
  const body = request.body as any;

  if (!body.refreshToken) {
    return reply.status(401).send({ error: 'Token saknas' });
  }

  try {
    const decoded = request.server.jwt.verify(body.refreshToken) as any;
    const newAccessToken = request.server.jwt.sign(
      { id: decoded.id },
      { expiresIn: '15m' }
    );
    return reply.send({ accessToken: newAccessToken });
  } catch (error) {
    return reply.status(403).send({ error: 'Fel token' });
  }
};