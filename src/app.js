import express from "express"
import morgan from "morgan"
import passport from "passport"
const session=require("express-session")

/////////////ROUTES////////////////////
import productRoutes from "./routes/product.routes.js"
import authRoutes from "./routes/auth.routes.js"
import userRoutes from "./routes/user.routes.js"
import paymentRoutes from "./routes/payment.routes.js"
import {createRoles} from "./libs/initialSetup.js"

const app=express()
createRoles()

/////////////MIDDLEWARES///////////////
app.use(express.json())
app.use(morgan("dev"))
//app.use(passport.initialize())

//esto solo para dev en produccion cambiar

app.use(session({
    secret: 'mySecret',
    resave:false,
    saveUninitialized:false,
    cookie:{secure:false}

  }))

app.use(passport.initialize())
app.use(passport.session())
/////////////ROUTES////////////////////
app.use("/products",productRoutes)
app.use("/auth",authRoutes)
app.use("/user",userRoutes)
app.use("/payment",paymentRoutes)

export default app