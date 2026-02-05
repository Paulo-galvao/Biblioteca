import express from "express";
import authorization from "../middlewares/authorization.js";
import {
    index,
    destroy,
    store,
    update,
    getByRate,
    show,
    getByDate,
    search,
} from '../controllers/book.controller.js'

const router = express.Router();

router.get('/', index);
router.post('/', authorization, store);
router.put('/:id', authorization, update);
router.delete('/:id', authorization, destroy);
router.get('/getByRate', getByRate);
router.get('/getByDate', getByDate);
router.get('/search', search);
router.get('/:id', show);

export default router;