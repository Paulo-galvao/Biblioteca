import express from 'express';
import {
    index, store
} from "../controllers/rate.controller.js"
import authorization from '../middlewares/authorization.js';

const router = express.Router();

router.get("/", index);
router.post("/:id", authorization, store);

export default router;