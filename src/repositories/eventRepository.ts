import pool from '../config/db.ts';

// Skapa event (Create)
export const createEvent = async (title, description, date, created_by) => {
  const result = await pool.query(
    'INSERT INTO events (title, description, event_date, created_by) VALUES ($1, $2, $3, $4) RETURNING *',
    [title, description, date, created_by]
  );
  return result.rows[0];
};

// Hämta alla (Read)
export const getAllEvents = async () => {
  const result = await pool.query('SELECT * FROM events');
  return result.rows;
};

// Uppdatera event (Update)
export const updateEvent = async (id, title, description, date) => {
  const result = await pool.query(
    'UPDATE events SET title = $1, description = $2, date = $3 WHERE id = $4 RETURNING *',
    [title, description, date, id]
  );
  return result.rows[0];
};

// Radera event (Delete)
export const deleteEvent = async (id) => {
  await pool.query('DELETE FROM events WHERE id = $1', [id]);
  return true;
};