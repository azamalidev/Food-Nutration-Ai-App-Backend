import express from "express";
import { } from "dotenv/config";
import loaders from "./loaders/index.js";
import config from "./config/index.js";

// Create app first
const app = express();

// Initialize loaders (middleware, routes, etc.)
await loaders.init({ expressApp: app });

// ✅ Vercel needs this export
export default app;
