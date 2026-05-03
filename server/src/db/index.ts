import { drizzle } from 'drizzle-orm/neon-http';
import { DATABASE_URL } from '../utils/config.util.js';

const db = drizzle(DATABASE_URL);

export default db;