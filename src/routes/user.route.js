import express from "express";
import {
    destroy,
    index,
    store,
    update,
    show
} from '../controllers/user.controller.js'

const router = express.Router();

router.get('/', index);
router.post('/', store);
router.put('/:id', update);
router.delete('/:id', destroy);
router.get('/:id', show);

export default router;