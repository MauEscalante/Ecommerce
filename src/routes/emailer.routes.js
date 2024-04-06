import { Router } from "express";
import {sendEmail} from '../controller/emailer.controller.js'

const router=Router()

router.get('/sendEmail', sendEmail)

export default router;
