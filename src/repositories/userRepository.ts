import pool from '../config/db.ts';

export const createUser = async (email, passwordHash) => {
  const query = 'INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING id, email, role';
  const { rows } = await pool.query(query, [email, passwordHash]);
  return rows[0];
};

export const findUserByEmail = async (email) => {
  const query = 'SELECT * FROM users WHERE email = $1';
  const { rows } = await pool.query(query, [email]);
  return rows[0];
};