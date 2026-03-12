import pool from '../config/db.ts';

// Boka event (Create)
export const createRegistration = async (user_id, event_id) => {
  const result = await pool.query(
    'INSERT INTO registrations (user_id, event_id) VALUES ($1, $2) RETURNING *',
    [user_id, event_id]
  );
  return result.rows[0];
};

// Hämta en användares bokningar (Read - med relation!)
export const getUserRegistrations = async (user_id) => {
  // JOIN hämtar event-infon för de events användaren bokat
  const result = await pool.query(
    'SELECT e.* FROM events e JOIN registrations r ON e.id = r.event_id WHERE r.user_id = $1',
    [user_id]
  );
  return result.rows;
};

// Avboka (Delete)
export const deleteRegistration = async (user_id, event_id) => {
  await pool.query(
    'DELETE FROM registrations WHERE user_id = $1 AND event_id = $2',
    [user_id, event_id]
  );
  return true;
};