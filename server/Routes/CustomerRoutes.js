import express from "express";
import { createCustomerProfile, getCustomerProfile, getWorkerAddress, getWorkerProfile, getWorkerProfiles, updateCustomerProfile } from "../Controllers/CustomerController.js";
import auth  from "../Middleware/authMiddleware.js";

const customerRouter = express.Router();

customerRouter.post('/createCustomerProfile', auth, createCustomerProfile);
customerRouter.get('/getCustomerProfile', auth, getCustomerProfile);
customerRouter.patch('/updateCustomerProfile', auth, updateCustomerProfile);

customerRouter.get("/getWorkerProfiles", auth, getWorkerProfiles);
customerRouter.post("/getWorkerProfile", auth, getWorkerProfile);
customerRouter.post("/getWorkerAddress" , auth, getWorkerAddress);

export default customerRouter;
