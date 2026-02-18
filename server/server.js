
import './config/instrument.js'
import express from 'express';
import cors from 'cors'
import 'dotenv/config'
import { connect } from 'mongoose';
import connectDB from './config/db.js';

import * as Sentry from "@sentry/node";
import { clerkWebhooks } from './controllers/webhooks.js';



//Initialize Express
const app = express()

//connect to database
await connectDB()

//Middlewares
app.use(cors())

app.post(
  "/webhooks",
  express.raw({ type: "application/json" }),
  clerkWebhooks
);

app.use(express.json())

//Routes
app.get('/' , (req, res) =>res.send("API Working"))
app.get("/debug-sentry", function mainHandler(req, res) {
  throw new Error("My first Sentry error!");
});



//PORT
const PORT = process.env.PORT || 5000


Sentry.setupExpressErrorHandler(app)

app.listen(PORT, ()=>{
    console.log(`Server is runnig on ${PORT}`)
})
console.log("DATABASE NAME:" + process.env.MONGODB_URI)

