import { Router } from "express";
import { createOrder,captureOrder,cancelPayment,createSession,paymentSuccess,paymentCancel } from "../controller/payment.controller.js";
import { verifyToken } from "../middlewares/authJwt.js";

const router=Router()

///////////////////PAYPAL//////////////////
router.get('/create-paypal-order',[verifyToken], createOrder)
router.get("/capture-paypal-order", captureOrder);
router.get("/cancel-paypal-order/:saleId", cancelPayment);

///////////////////Stripe//////////////////
router.get("/create-checkout-session",[verifyToken],createSession)
router.get("/success",paymentSuccess)
router.get("/cancel",paymentCancel)


export default router;