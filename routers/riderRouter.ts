import express from "express";

import riderController from "../controllers/riderController";

const router: express.Router = express.Router();

router.post("/signup", riderController.registerRider);
router.post("/login", riderController.loginRider);

module.exports = router;
