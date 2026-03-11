import * as repo from '../repositories/registrationRepository.js';

// Boka event
export const bookEvent = async (request, reply) => {
  const { user_id, event_id } = request.body;
  const reg = await repo.createRegistration(user_id, event_id);
  return reply.status(201).send(reg);
};

// Hämta bokningar
export const getMyEvents = async (request, reply) => {
  const { user_id } = request.params;
  const events = await repo.getUserRegistrations(user_id);
  return reply.send(events);
};

// Avboka event
export const cancelBooking = async (request, reply) => {
  const { user_id, event_id } = request.body;
  await repo.deleteRegistration(user_id, event_id);
  return reply.send({ message: 'Avbokad' });
};