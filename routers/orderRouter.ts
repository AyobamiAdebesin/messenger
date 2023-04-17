import orderController from "../controllers/orderController";
import express from "express";
import riderRequired from "../middleware/riderAuthMiddleware";
import customerRequired from "../middleware/customerAuthMiddleware";
import thirdPartyRequired from "../middleware/thirdpartyAuthMiddleware";
const router: express.Router = express.Router();

router.post("/create", customerRequired, orderController.createOrder);

router.put(
  "/update/:orderId",
  riderRequired,
  orderController.updateOrderStatus
);
router.put("/accept/:orderId", riderRequired, orderController.acceptOrder);
router.get("/fetch_all", riderRequired, orderController.fetchAllOrders);
router.get("/get_order/:orderId", riderRequired, orderController.getOrdersByCustomerId);
// router.get("/count_orders", riderRequired, orderController.countAllOrders);
// router.get("/get_pending", riderRequired, orderController.getPendingOrders);
// router.get("/get_delivered", riderRequired, orderController.getDeliveredOrders);
// router.get("/get_cancelled", riderRequired, orderController.getCancelledOrders);
// router.get("/get_rider_orders", riderRequired, orderController.getRiderOrders);

module.exports = router;
