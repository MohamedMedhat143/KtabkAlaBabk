import { Router } from "express";
import { chnagePassword, signin, signup } from "./auth.controller.js";
import { cheackPhone } from "../../middleware/cheackPhone.js";
import { validate } from "../../middleware/validation.js";
import { signinval, signupval } from "./auth.validation.js";
import { verifyToken } from "../../middleware/verifyToken.js";
const authAdminRouter = Router();

authAdminRouter.post(
  "/signup",
  verifyToken,
  validate(signupval),
  cheackPhone,
  signup
);
authAdminRouter.post("/signin", validate(signinval), signin);
authAdminRouter.post("/changepassword", chnagePassword);

export default authAdminRouter;
