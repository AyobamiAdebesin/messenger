import { IOrder, Order } from "../models/orders";
import { Request, Response } from "express";
import { OrderStatus } from "../models/orders";
import { Rider, RiderStatus } from "../models/riders";
import { Types } from "mongoose";

class orderController {
  static async createOrder(req: Request, res: Response) {
    /**
     * @description Endpoint for a Customer to create an order
     * @param {Object} req - The request object
     * @param {Object} res - The response object
     * @route POST /api/orders/create
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
      const newOrder: IOrder = await Order.create({
        customer_id: req.customer!._id,
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
          message: "Order created successfully!",
        };
        res.status(200).send(returnObject);
      }
    } catch (error) {
      res.status(401).send("Unable to create order. Try again!");
      // throw new Error("Unable to create order. Try again");
    }
  }
  static async updateOrderStatus(req: Request, res: Response) {
    /**
     * @description Endpoint for a Rider to update the status of an order
     * For a Rider to update the status of an order, the rider must be assigned to the order
     * @param {Object} req - The request object
     * @param {Object} res - The response object
     * @route PUT /api/orders/update_order_status/:orderId
     * @returns {Object} - Returns a json object with the order's id, customer_id, pickup_address, delivery_address, status, and token
     * @throws  {Error} - Throws an error if the order's customer_id, pickup_address, or delivery_address is not provided
     */
    const orderId: string = req.params.orderId;
    const { status } = req.body;
    if (!status) {
      res.status(400).send("Please fill all fields");
    }

    try {
      const order: IOrder | null = await Order.findOne({ _id: orderId });
      if (!order) {
        res.status(400).send("Order not found");
      }
      if (new Types.ObjectId(req.rider!._id) !== order!.rider_id) {
        res.status(400).send("You are not assigned to this order");
      }
      if (order && status === "Delivered") {
        order.status = OrderStatus.Delivered;
        await order.save();
      } else if (order && status === "Cancelled") {
        order.status = OrderStatus.Cancelled;
        await order.save();
      } else if (order && status === "InProgress") {
        order.status = OrderStatus.InProgress;
        await order.save();
      } else if (order && status === "Pending") {
        order.status = OrderStatus.Pending;
        await order.save();
      } else {
        return;
      }

      const returnObject = {
        _id: order._id,
        order_description: order.order_description,
        customer_id: order.customer_id,
        pickup_address: order.pickup_address,
        delivery_address: order.delivery_address,
        status: status,
        message: "Order updated successfully!",
      };
      res.status(200).send(returnObject);
    } catch (error) {
      res.status(400).send("Error! Order not found");
      throw new Error("Error, Order not found");
    }
  }

  static async acceptOrder(req: Request, res: Response) {
    /**
     * @description Endpoint for a rider to accept an order if rider is available and order is pending.
     * For a rider to accept an order, the rider must be available, he must be active(allowed to accept orders)
     * and the order must be pending
     * @param {Object} req - The request object
     * @param {Object} res - The response object
     * @route PUT /api/orders/accept/:orderId
     * @returns
     *
     */
    const orderId: string = req.params.orderId;
    const order: IOrder | null = await Order.findOne({ _id: orderId })
      .populate("rider_id")
      .populate("customer_id");
    // order = await Rider.populate(order, {
    //   path: "rider_id",
    //   select: "name phone_number",
    // });

    // Check if order exists
    if (!order) {
      res.status(400).send("Order not found");
      throw new Error("Order not found");
    }

    // Check if rider is active
    if (req.rider!.isActive === false) {
      res.status(400).send("You are not active. You cannot accept orders");
      throw new Error("You are not active. You cannot accept orders");
    }

    // Check if rider is available and if order is pending
    if (
      req.rider!.status === RiderStatus.Available &&
      order.status === OrderStatus.Pending
    ) {
      // Update order status to IN_PROGRESS and assign rider to order
      // Update current_order of the rider to the order
      // Update current_location of the rider to the pickup_address of the order
      // Note that in a real world scenario, the rider's current_location should be updated with a location tracking service
      order.status = OrderStatus.InProgress;
      order.rider_id = new Types.ObjectId(req.rider!._id);
      req.rider!.current_order = new Types.ObjectId(order._id);
      req.rider!.status = RiderStatus.Busy;
      req.rider!.current_location = order.pickup_address;
      await req.rider!.save();
      await order.save();

      const returnObject = {
        _id: order._id,
        order_description: order.order_description,
      };
      res.status(200).send("Order accepted");
      return;
    } else if (req.rider!.status === RiderStatus.Busy) {
      res.status(400).send("You are not available");
    } else if (order.status === OrderStatus.InProgress) {
      res
        .status(400)
        .send("Order is already in progress. Kindly find another order");
    } else if (order.status === OrderStatus.Cancelled) {
      res
        .status(400)
        .send("Order has been cancelled. Kindly find another order");
    } else if (order.status === OrderStatus.Delivered) {
      res
        .status(400)
        .send("Order has been delivered. Kindly find another order");
    }
  }

  static async fetchAllOrders(req: Request, res: Response) {
    /**
     * @description Fetch all orders. This is done by Riders and Admins(in real world scenario)
     * @param {Object} req - The request object
     * @param {Object} res - The response object
     * @route GET /api/orders/fetch_all
     */
    try {
      const allOrders = await Order.find();
      return res.status(200).json(allOrders);
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
    try {
      const orders = await Order.find({ status: OrderStatus.Pending });
      res.status(200).send(orders);
    } catch (error) {
      res.status(400).send("Error fetching pending orders");
      throw new Error("Error fetching pending orders");
    }
  }

  static async getDeliveredOrders(req: Request, res: Response) {
    /**
     * @description Get all delivered orders
     *
     */
    try {
      const orders = await Order.find({ status: OrderStatus.Delivered });
      res.status(200).send(orders);
    } catch (error) {
      res.status(400).send("Error fetching delivered orders");
      throw new Error("Error fetching delivered orders");
    }
  }

  static async getCancelledOrders(req: Request, res: Response) {
    /**
     * @description Get all canceled orders
     *
     */
    try {
      const orders = await Order.find({ status: OrderStatus.Cancelled });
      res.status(200).send(orders);
    } catch (error) {
      res.status(400).send("Error fetching cancelled orders");
      throw new Error("Error fetching cancelled orders");
    }
  }

  // static async countAllOrdersByStatus(req: Request, res: Response) {
  // }
}
export default orderController;
