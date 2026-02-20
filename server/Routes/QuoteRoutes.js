import express from "express";
import { createQuote, getQuoteById, handleQuoteResponse } from "../Controllers/QuoteController.js";
import auth  from "../Middleware/authMiddleware.js"
const QuoteRouter = express.Router();

QuoteRouter.post("/createQuote" , auth, createQuote)
QuoteRouter.get("/getQuoteByBooking/:quoteId", auth, getQuoteById);
QuoteRouter.post("/handleQuoteResponse", auth, handleQuoteResponse);

export default QuoteRouter;