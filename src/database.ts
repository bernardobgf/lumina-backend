import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config({ quiet: true });

const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
  maxLifetimeSeconds: 60,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: Number(process.env.DB_PORT),
});

export default pool;
