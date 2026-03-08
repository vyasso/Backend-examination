import bcrypt from 'bcrypt';
import * as userRepository from '../repositories/userRepository.js';

// Registrering
export const registerUser = async (request, reply) => {
  const { email, password } = request.body;
  const hash = await bcrypt.hash(password, 10);
  const user = await userRepository.createUser(email, hash);
  return { message: 'Skapad', user };
};

// Inloggning
export const loginUser = async function(request, reply) {
  const { email, password } = request.body;

  // Hitta user
  const user = await userRepository.findUserByEmail(email);
  if (!user) return reply.status(401).send({ error: 'Fel' });

  // Kolla lösen
  const isMatch = await bcrypt.compare(password, user.password_hash);
  if (!isMatch) return reply.status(401).send({ error: 'Fel' });

  // Skapa JWT
  const token = this.jwt.sign({ id: user.id, role: user.role });

  return { token };
};