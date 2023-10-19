import express from 'express';
import { signin, signup } from '../controllers/auth.controller.js';

const router = express.Router();

router.post("/signup", signup); //called from auth.controller
router.get("/signin", signin);  //called from auth.controller

export default router;