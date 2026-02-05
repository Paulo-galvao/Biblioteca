import express from "express";
import authorization from "../middlewares/authorization.js";
import {
    destroy,
    index,
    store,
    update,
    resetPassword,
    show,
    login,
    dash
} from '../controllers/user.controller.js'

const router = express.Router();

router.get('/', index);
router.post('/', store);
router.patch('/:id', authorization, update);
router.patch('/resetPassword/:id', authorization, resetPassword)
router.delete('/:id', authorization, destroy);
router.post('/login', login);
router.get('/dashboard', authorization, dash);
router.get('/:id', show);

export default router;