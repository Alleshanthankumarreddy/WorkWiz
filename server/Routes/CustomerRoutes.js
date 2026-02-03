import express from "express";
import { createCustomerProfile, getCustomerProfile, updateCustomerProfile } from "../Controllers/CustomerController.js";
import auth  from "../Middleware/authMiddleware.js";

const customerRouter = express.Router();

customerRouter.post('/createCustomerProfile', auth, createCustomerProfile);
customerRouter.get('/getCustomerProfile', auth, getCustomerProfile);
customerRouter.patch('/updateCustomerProfile', auth, updateCustomerProfile);

export default customerRouter;
