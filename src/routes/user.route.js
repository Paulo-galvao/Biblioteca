import express from "express";
import authorization from "../middlewares/authorization.js";
import {
    destroy,
    index,
    store,
    update,
    show,
    login,
    dash
} from '../controllers/user.controller.js'

const router = express.Router();

router.get('/', index);
router.post('/', store);
router.put('/:id', authorization, update);
router.delete('/:id', authorization, destroy);
router.post('/login', login);
router.get('/dashboard', authorization, dash);
router.get('/:id', show);

export default router;