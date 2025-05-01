import express, { urlencoded } from "express";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import cors from "cors"
import dotenv from 'dotenv';

const app = express();
dotenv.config();
console.log('CORS Origin:', process.env.FRONTEND_URL);
app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
}))
app.use(express.json());
app.use(urlencoded({extended:true}));
app.use(express.static("../public"));
app.use(cookieParser());
app.use(helmet({
    hsts: false
}))



app.use((err, req, res, next) => {
    console.log("error handling express: ", err)
    next();
})

export default app;