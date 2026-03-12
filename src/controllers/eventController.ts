import * as eventRepository from '../repositories/eventRepository.ts';

// Skapa
export const create = async (request, reply) => {
  const { title, description, date } = request.body;
  const created_by = request.user.id;
  const event = await eventRepository.createEvent(title, description, date, created_by);
  return reply.status(201).send(event);
};

// Hämta
export const getAll = async (request, reply) => {
  const events = await eventRepository.getAllEvents();
  return reply.send(events);
};

// Uppdatera
export const update = async (request, reply) => {
  const { id } = request.params;
  const { title, description, date } = request.body;
  const event = await eventRepository.updateEvent(id, title, description, date);
  return reply.send(event);
};

// Radera
export const remove = async (request, reply) => {
  const { id } = request.params;
  await eventRepository.deleteEvent(id);
  return reply.send({ message: 'Raderad' });
};