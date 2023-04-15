import { Order } from "../models/orders";
import { Request, Response } from "express";

enum OrderStatus {
  Pending = "pending",
  InProgress = "in_progress",
  Delivered = "delivered",
  Cancelled = "cancelled",
}

enum RiderStatus {
  Available = "available",
  Busy = "busy",
  OnBreak = "on_break",
}

class orderController {
  static async createOrder(req: Request, res: Response) {
    /**
     * @description Create a new order
     * @param {Object} req - The request object
     * @param {Object} res - The response object
     * @route POST /api/orders/create_order
     * @returns {Object} - Returns a json object with the order's id, customer_id, pickup_address, delivery_address, status
     * @throws  {Error} - Throws an error if the order's customer_id, pickup_address, or delivery_address is not provided
     *
     */
    const { order_description, pickup_address, delivery_address } = req.body;
    if (!order_description || !pickup_address || !delivery_address) {
      res.status(400).send("Please fill all fields");
      throw new Error("Please fill all fields");
    }
    try {
      const newOrder = await Order.create({
        customer_id: (<any>req)["user"].id,
        order_description: order_description,
        pickup_address: pickup_address,
        delivery_address: delivery_address,
        status: OrderStatus.Pending,
      });
      if (newOrder) {
        const returnObject = {
          _id: newOrder._id,
          order_description: order_description,
          customer_id: newOrder.customer_id,
          pickup_address: newOrder.pickup_address,
          delivery_address: newOrder.delivery_address,
          status: newOrder.status,
        };
        res.status(200).send(returnObject);
      }
    } catch (error) {
      res.status(401).send("Unauthorized request");
      throw new Error("Unauthorized request");
    }
  }
  static async updateOrderStatus(req: Request, res: Response) {
    /**
     * @description Update order status
     * @param {Object} req - The request object
     * @param {Object} res - The response object
     * @route PUT /api/orders/update_order_status/:orderId
     * @returns {Object} - Returns a json object with the order's id, customer_id, pickup_address, delivery_address, status, and token
     * @throws  {Error} - Throws an error if the order's customer_id, pickup_address, or delivery_address is not provided
     */
    const orderId: string = req.params.orderId;
    const { status } = req.body;
    console.log(orderId);
    try {
      const order: any = await Order.findOne({ _id: orderId });
      if (order) {
        order.status = (<any>OrderStatus)[status];
        order.save();

        const returnObject = {
          _id: order._id,
          order_description: (<any>order).order_description,
          customer_id: order.customer_id,
          pickup_address: order.pickup_address,
          delivery_address: order.delivery_address,
          status: status,
        };
        res.status(200).send(returnObject);
      }
    } catch (error) {
      res.status(400).send("Error! Order not found");
      throw new Error("Error, order not found");
    }
  }

  static async acceptOrder(req: Request, res: Response) {
    /**
     * @description A rider accepts an order if available
     * @param {Object} req - The request object
     * @param {Object} res - The response object
     * @route PUT /api/orders/accept_order/:orderId
     * @returns
     *
     */
    const orderId: string = req.params.orderId;
    const order: any = await Order.find({ _id: orderId });

    // Check if rider is available and if order is pending
    if (
      (<any>req)["user"].status === RiderStatus.Available &&
      (<any>order).status === OrderStatus.Pending
    ) {
      // Update order status to in progress and assign rider to order
      order[0].status = OrderStatus.InProgress;
      order[0].rider_id = (<any>req)["user"].id;
      order[0].save();
      res.status(200).send("Order accepted");

      // Update rider status to busy
      (<any>req)["user"].status = RiderStatus.Busy;
    } else {
      res.status(400).send("You are not available");
    }
  }

  static async fetchAllOrders(req: Request, res: Response) {
    /**
     * @description Fetch all orders
     * @param {Object} req - The request object
     * @param {Object} res - The response object
     * @route GET /api/orders/fetch_all
     */
    try {
      const allOrders = await Order.find();
      return res.status(200).send(allOrders);
    } catch (error) {
      res.status(400).send("Error fetching orders. Try again!");
      throw new Error("Error fetching orders. Try again!");
    }
  }

  static async getOrdersByCustomerId(req: Request, res: Response) {
    /**
     * @description Get all orders of a customer by customer_id
     * @param {Object}
     */
    try {
      const orders = Order.find({ customer_id: (<any>req)["user"].id });
      res.status(200).send(orders);
    } catch (error) {
      res.status(400).send("Error! Order not found");
      throw new Error("Error, order not found");
    }
  }

  static async countAllOrders(req: Request, res: Response) {
    /**
     * @description Get all orders for a customer by customer_id
     * @param {Object}
     */
    try {
      const orders = await Order.find();
      res.status(200).send(orders);
    } catch (error) {
      res.status(400).send("Error fetching orders");
      throw new Error("Error fetching orders");
    }
  }

  static async getPendingOrders(req: Request, res: Response) {
    /**
     * @description Get all pending orders
     * @param {Object}
     * @returns
     */
    try{
      const orders = await Order.find({ status: OrderStatus.Pending });
      res.status(200).send(orders);
    }
    catch(error){
      res.status(400).send("Error fetching pending orders");
      throw new Error("Error fetching pending orders");
    }
  }

  static async getDeliveredOrders(req: Request, res: Response) {
    /**
     * @description Get all delivered orders
     * 
     */
    try{
      const orders = await Order.find({ status: OrderStatus.Delivered });
      res.status(200).send(orders);
    }
    catch(error){
      res.status(400).send("Error fetching delivered orders");
      throw new Error("Error fetching delivered orders");
    }
  }

  static async getCancelledOrders(req: Request, res: Response) {
    /**
     * @description Get all canceled orders
     * 
     */
    try{
      const orders = await Order.find({ status: OrderStatus.Cancelled });
      res.status(200).send(orders);
    }
    catch(error){
      res.status(400).send("Error fetching cancelled orders");
      throw new Error("Error fetching cancelled orders");
    }
  }

  // static async countAllOrdersByStatus(req: Request, res: Response) { 
  // } 
}
export default orderController;
