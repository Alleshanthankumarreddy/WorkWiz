import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./Config/mongodb.js";

import customerProfileModel from "./Models/CustomerProfileModel.js";
import workerProfileModel from "./Models/WorkerProfileModel.js";
import userModel from "./Models/UserModel.js";
import otpModel from "./Models/OtpModel.js";


import customerRouter from "./Routes/CustomerRoutes.js";
import workerRouter from "./Routes/WorkerRoutes.js";
import AuthRouter from "./Routes/AuthRoutes.js";

dotenv.config()

const app = express();
const PORT = process.env.PORT || 4000;



app.use(express.json());
app.use(cors());

await connectDB()

app.use('/api/customer',customerRouter);
app.use('/api/worker',workerRouter);
app.use('/api/auth',AuthRouter);

app.listen(PORT , () => {
    console.log("Server is running on PORT" + PORT);
})

