import express from "express";
import ThirdPartyController from "../controllers/thirdPartyController";
import thirdPartyRequired from "../middleware/thirdpartyAuthMiddleware";

const router: express.Router = express.Router();

router.get("/orders", thirdPartyRequired, ThirdPartyController.getAllOrdersByLogistics);
router.get("/orders/:orderId", thirdPartyRequired, ThirdPartyController.getSingleOrder);
router.get("/orders", thirdPartyRequired, ThirdPartyController.getOrderByStatus);

//router.get("/get_all", ThirdPartyController.getAllThirdParties);

module.exports = router;