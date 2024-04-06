import app from "./app"
import "./database.js"
import {HOST,PORT} from "./config.js"

app.listen(PORT)

console.log("Server listen on port: ",HOST)