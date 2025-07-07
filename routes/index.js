import express from "express";

// routes

import userRoute from "./user/index.js";

import authenticate from "../middlewares/authenticate.js";

const protectedRouter = express.Router();
const unProtectedRouter = express.Router();



// Un-Protected Routes
unProtectedRouter.use("/", userRoute);


export { protectedRouter, unProtectedRouter };
