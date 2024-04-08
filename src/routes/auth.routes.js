import { Router } from "express";
import {
  signinHandler,
  signupHandler,
  googleCallback,
  logSuccess,
  logFailed
} from "../controller/auth.controller.js";
const passport=require("passport")
import "../middlewares/google.js";

const router = Router();

router.use((req, res, next) => {
  res.header(
    "Access-Control-Allow-Headers",
    "x-access-token, Origin, Content-Type, Accept"
  );
  next();
});

////////AUTENTIFICACION EN LA PAG/////////////////
router.post("/signup", signupHandler);

router.post("/signin", signinHandler);

////////AUTENTIFICACION CON GOOGLE////////////////
router.get("/auth/google", 
passport.authenticate("auth-google", {
  scope: [
    "https://www.googleapis.com/auth/userinfo.profile",
    "https://www.googleapis.com/auth/userinfo.email",
  ],
  session: false,
}),
);

router.get("/auth/google/callback",googleCallback)

router.get('/login/succes', logSuccess)

router.get('/login/failed', logFailed)

export default router;