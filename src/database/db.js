import { Pool } from "pg";
import "dotenv/config";

const pool = new Pool({
  ssl: true,
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});


export default pool; 
