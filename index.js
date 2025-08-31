import app from "express";

import cors from "cors";
  // to give access for another 
 // database connection codes
import jwt from "jsonwebtoken";
  // module used for session token generation
import registercon from "./routes/register.js";
import update1 from "./routes/update.js";
import router from "./routes/login.js";

const express = app();



express.use(app.json());  // middleware for receiving JSON requests
express.use(cors());      // allows other platforms to access the endpoint

// Database connection

express.use(registercon);
express.use(update1);
express.use(router);


express.listen(3000);







