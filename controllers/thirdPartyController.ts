import { Request, Response } from "express";
import { IThirdParty } from "../models/thirdParty";
import { IOrder, Order } from "../models/orders";
import { ThirdParty } from "../models/thirdParty";
class ThirdPartyController {
  static async getAllOrdersByLogistics(req: Request, res: Response) {
    /**
     * @description Get all orders of a logistics company
     * @param req : Request
     * @param res : Response
     * @returns
     * @route POST /api/logistics/orders
     */
    const logisticsCompanyId = req.thirdParty!._id;

    try {
      const fetchOrders = await Order.find({
        logistic_companyId: logisticsCompanyId,
      });
      res.status(200).json(fetchOrders);
    } catch (err) {
      res.status(400).send("Error fetching orders");
    }
  }

  static async getSingleOrder(req: Request, res: Response) {
    /**
     * @description Get information about a single order of a logistics company
     * @param req : Request
     * @param res : Response
     * @returns
     * @route POST /api/logistics/orders/:orderId
     */
    const orderId : string = req.params.orderId;
    const logisticsCompanyId = req.thirdParty!._id;
    try {
      const fetchOrder : IOrder | null  = await Order.findOne({
        logistic_companyId: logisticsCompanyId,
        _id: orderId,
      });
      res.status(200).json(fetchOrder);
    } catch (err) {
      res.status(400).send("Couldn't fetch data");
    }
  }

  static async getOrderByStatus(req: Request, res: Response) {
    /**
     * @description Get orders by their status for a logistics company
     * @param req : Request
     * @param res : Response
     * @returns
     * @route POST /api/logistics/orders?status
     */
    const logisticsCompanyId = req.thirdParty!._id;
    const keyword = req.query.status
      ? { status: { $regex: req.query.search, $options: "i" } }
      : {};
    const users = await Order.find(keyword).find({
      logistic_companyId: { $eq: logisticsCompanyId },
    });
  }
}

export default ThirdPartyController;
