import express from 'express';
import { google, signin, signout, signup } from '../controllers/auth.controller.js';

const router = express.Router();

router.post("/signup", signup); //called from auth.controller
router.post("/signin", signin);  //called from auth.controller
router.post("/google", google);  //called from auth.controller
router.get("/signout", signout); //called from auth.controller

export default router;