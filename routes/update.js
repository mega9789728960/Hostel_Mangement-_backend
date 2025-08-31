import express from "express";
import authentication from "../controllers/authentication.js"
import update from "../controllers/update.js"
const update1 = express.Router();
update1.post("/update",authentication,update);


export default update1;