import express from "express";
import cors from "cors";


import registercon from "./routes/register.js";
import update1 from "./routes/update.js";
import router from "./routes/login.js";

const app = express();

app.use(express.json());  // middleware for receiving JSON requests
app.use(cors());          // allows other platforms to access the endpoint

// Register routes
app.use(registercon);
app.use(update1);
app.use(router);

// ⛔️ Remove app.listen()
// ✅ Instead, export the handler for Vercel
export default app;
