// Kontrollera JWT-token
export const authenticate = async (request, reply) => {
  try {
    await request.jwtVerify(); 
  } catch (err) {
    reply.status(401).send({ error: 'Obehörig - Ogiltig token' });
  }
};

// Kontrollera om användaren är admin
export const isAdmin = async (request, reply) => {
  // request.user skapas av jwtVerify()
  if (request.user.role !== 'admin') {
    return reply.status(403).send({ error: 'Åtkomst nekad - Endast admins' });
  }
};