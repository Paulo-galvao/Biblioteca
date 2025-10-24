import express from "express";
import authorization from "../middlewares/authorization.js";
import {
    destroy,
    index,
    store,
    update,
    show
} from '../controllers/book.controller.js'

const router = express.Router();

router.get('/', index);
router.post('/', authorization, store);
router.put('/:id', update);
router.delete('/:id', destroy);
router.get('/:id', show);

export default router;