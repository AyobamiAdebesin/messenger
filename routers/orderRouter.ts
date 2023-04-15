import orderController from "../controllers/orderController";
import express from "express";
import protect from "../middleware/authMiddleware";
const router: express.Router = express.Router();


router.post("/place_order", protect, orderController.createOrder);
router.put("/update/:orderId", protect, orderController.updateOrderStatus);
router.put("/accept/:orderId", protect, orderController.acceptOrder);
router.get("/fetch_all", protect, orderController.fetchAllOrders);
router.get("/get_order/:orderId", protect, orderController.getOrdersByCustomerId);
router.get("/count_orders", protect, orderController.countAllOrders);
router.get("/get_pending", protect, orderController.getPendingOrders);
router.get("/get_delivered", protect, orderController.getDeliveredOrders);
router.get("/get_cancelled", protect, orderController.getCancelledOrders);
// router.get("/get_rider_orders", protect, orderController.getRiderOrders);


module.exports = router;