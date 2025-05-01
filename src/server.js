import dotenv from "dotenv";
import app from "./app.js";


dotenv.config({
    path: './.env'
})



const port = process.env.PORT ?? 3000;
import connectDB from "./config/database.js";
connectDB()
    .then(()=>{
        app.listen(port, ()=>{
            console.log(`Server is running at http://localhost:${port}`);
        })
    })
    .catch((err)=>{
        console.log(`Unable to start server due to failure in database connection`)
    });

// router imports
import authRouter from "./routes/auth.routes.js";
import sadhnaRouter from "./routes/sadhna.routes.js";
import userRouter from "./routes/user.routes.js"

// routes
app.use("/auth", authRouter);
app.use("/sadhna", sadhnaRouter);
app.use("/user", userRouter);