import bcrypt from 'bcrypt';
import * as userRepository from '../repositories/userRepository.js';

// Registrering
export const registerUser = async (request, reply) => {
  const { email, password } = request.body;
  const hash = await bcrypt.hash(password, 10);
  const user = await userRepository.createUser(email, hash);
  return reply.status(201).send({ message: 'Skapad', user });
};

// Inloggning
export const loginUser = async function(request, reply) {
  const { email, password } = request.body;

  // Hitta user
  const user = await userRepository.findUserByEmail(email);
  if (!user) return reply.status(401).send({ error: 'Fel e-post eller lösenord' });

  // Kolla lösen
  const isMatch = await bcrypt.compare(password, user.password_hash);
  if (!isMatch) return reply.status(401).send({ error: 'Fel e-post eller lösenord' });

  // 1. Skapa Access Token (kort tid, minuter)
  const accessToken = this.jwt.sign(
    { id: user.id, role: user.role },
    { expiresIn: '15m' }
  );

  // 2. Skapa Refresh Token (lång tid, 7 dagar)
  const refreshToken = this.jwt.sign(
    { id: user.id }, // Behöver bara ID
    { expiresIn: '7d' }
  );

  // Returnera båda till användaren
  return reply.send({ accessToken, refreshToken });
};

// Förnya Access Token (VG-krav)
export const refreshTokenUser = async function(request, reply) {
  const { refreshToken } = request.body;

  if (!refreshToken) {
    return reply.status(401).send({ error: 'Refresh token saknas' });
  }

  try {
    // Kolla att refresh-token är giltig
    const decoded = request.server.jwt.verify(refreshToken);
    
    // Skapa en ny Access Token som gäller 15 min till
    const newAccessToken = request.server.jwt.sign(
      { id: decoded.id }, 
      { expiresIn: '15m' }
    );

    return reply.send({ accessToken: newAccessToken });
  } catch (error) {
    return reply.status(403).send({ error: 'Ogiltig eller utgången refresh token' });
  }
};