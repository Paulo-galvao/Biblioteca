import express from "express";
import authorization from "../middlewares/authorization.js";
import {
    destroy,
    index,
    store,
    update,
    show,
    login
} from '../controllers/user.controller.js'

const router = express.Router();

router.get('/', index);
router.post('/', store);
router.put('/:id', authorization, update);
router.delete('/:id', authorization, destroy);
router.get('/:id', show);
router.post('/login', login);

export default router;