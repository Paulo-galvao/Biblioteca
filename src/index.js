import express from 'express';
import cors from 'cors';
import userRouter from './routes/user.route.js'
import bookRouter from './routes/book.route.js'

import "dotenv/config";
import pool from './database/db.js';

const api_port = process.env.API_PORT || 3022;
const app = express();

app.use(express.json());
app.use(cors());

app.get('/', async function(req, res) {
    try {
        const data = await pool.query(`
            SELECT * FROM biblioteca.teste;
        `);

        res.status(200).json(data);
    } catch (error) {
        res.status(500).json(error.message);
    }
});

app.use('/users', userRouter);
app.use('/books', bookRouter);

app.listen( api_port, () => {
    console.log("Listening on p:", api_port);
});