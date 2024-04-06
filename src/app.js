import express from "express"
import morgan from "morgan"
import pkg from "../package.json"
import productRoutes from "./routes/product.routes.js"
import authRoutes from "./routes/auth.routes.js"
import userRoutes from "./routes/user.routes.js"
import paymentRoutes from "./routes/payment.routes.js"
import {createRoles} from "./libs/initialSetup.js"

const app=express()
createRoles()

app.set("pkg",pkg)
app.use(express.json())

app.use(morgan("dev"))

app.get("/",(req,res)=>{
    res.json({
        author: app.get("pkg").author,
        description: app.get("pkg").description,
        version: app.get("pkg").version
    })
})

app.use("/products",productRoutes)
app.use("/auth",authRoutes)
app.use("/user",userRoutes)
app.use("/payment",paymentRoutes)

export default app