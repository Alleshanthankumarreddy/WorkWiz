import express from "express";
import { addWorkerBankDetails, createWorkerAddress, createWorkerProfile, getPastBookings, getWorkerAddress, getWorkerBankDetails, getWorkerDocuments, getWorkerProfile, toggleWorkerAvailability, updateWorkerAddress, updateWorkerProfile, uploadWorkerDocument } from "../Controllers/WorkerController.js";
import auth from "../Middleware/authMiddleware.js";
import upload from "../Middleware/multer.js";

const workerRouter = express.Router();

workerRouter.post("/createWorkerProfile", auth, upload.single("photo"), createWorkerProfile);
workerRouter.post("/getWorkerProfile", auth, getWorkerProfile);
workerRouter.patch("/updateWorkerProfile", auth, updateWorkerProfile);

workerRouter.post("/createWorkerAddress", auth, createWorkerAddress);
workerRouter.post("/getWorkerAddress", auth, getWorkerAddress);
workerRouter.patch("/updateWorkerAddress", auth, updateWorkerAddress);

workerRouter.post("/uploadWorkerDocument", auth, upload.single("document"), uploadWorkerDocument);
workerRouter.post("/getWorkerDocuments", auth, getWorkerDocuments);

workerRouter.post("/addWorkerBankDetails", auth, addWorkerBankDetails);
workerRouter.post("/getWorkerBankDetails", auth, getWorkerBankDetails);

workerRouter.patch("/toggleWorkerAvailability", auth, toggleWorkerAvailability);
workerRouter.post("/getPastBookings", auth, getPastBookings);

export default workerRouter;