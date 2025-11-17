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
router.put('/:id', authorization, update);
router.delete('/:id', authorization, destroy);
router.get('/:id', show);

export default router;