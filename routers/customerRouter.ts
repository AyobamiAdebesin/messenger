import express from "express";
import customerController from "../controllers/customerController";

const router: express.Router = express.Router();

router.post("/signup", customerController.registerCustomer);
router.post("/login", customerController.loginCustomer);

module.exports = router;
