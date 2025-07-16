import { Router } from "express";
import { confirmOrder, createOrder, getOrder } from "./order.controller.js";
import { verifyToken } from "../../middleware/verifyToken.js";
import { fileUpload } from "../../middleware/fileUpload.js";

const orderRouter = Router();

orderRouter.get("/getorder", verifyToken, getOrder);
orderRouter.post("/createorder/:id", verifyToken, createOrder);
orderRouter.put(
  "/confirmorder/:id",
  verifyToken,
  fileUpload({}).fields([{ name: "receiptImage", maxCount: 1 }]),
  confirmOrder
);
export default orderRouter;
