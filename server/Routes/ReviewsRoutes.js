import express from "express";
import auth from "../Middleware/authMiddleware.js"
import { createReview, getAverageRating, getWorkerReviews } from "../Controllers/ReviewsController.js"

const reviewsRouter = express.Router();

reviewsRouter.post("/create", createReview);
reviewsRouter.get("/average/:workerEmail", getAverageRating);
reviewsRouter.post("/getWorkerReviews", auth, getWorkerReviews);

export default reviewsRouter;