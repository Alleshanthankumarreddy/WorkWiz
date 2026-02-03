import express from "express";
import { createWorkerAddress, createWorkerProfile, getWorkerAddress, getWorkerProfile, updateWorkerAddress, updateWorkerProfile, uploadWorkerDocument } from "../Controllers/WorkerController.js";
import auth from "../Middleware/authMiddleware.js";
import upload from "../Middleware/multer.js";

const workerRouter = express.Router();

workerRouter.post("/createWorkerProfile", auth, upload.single("photo"), createWorkerProfile);
workerRouter.get("/getWorkerProfile", auth, getWorkerProfile);
workerRouter.patch("/updateWorkerProfile", auth, updateWorkerProfile);

workerRouter.post("/createWorkerAddress", auth, createWorkerAddress);
workerRouter.get("/getWorkerAddress", auth, getWorkerAddress);
workerRouter.patch("/updateWorkerAddress", auth, updateWorkerAddress);

workerRouter.post("/uploadWorkerDocument", auth, upload.single("document"), uploadWorkerDocument);

export default workerRouter;