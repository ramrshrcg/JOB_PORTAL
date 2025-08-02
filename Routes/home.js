import express from "express";
import homeController from "../Controller/homeController.js";
const router = express.Router();

router.get("/", homeController);

export default router;
