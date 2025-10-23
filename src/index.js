import express from 'express';
import userRouter from './routes/user.route.js'
import cors from 'cors';

import "dotenv/config";

const api_port = process.env.API_PORT || 3022;
const app = express();

app.use(express.json());
app.use(cors());

app.use('/users', userRouter);

app.listen( api_port, () => {
    console.log("Listening on p:", api_port);
});