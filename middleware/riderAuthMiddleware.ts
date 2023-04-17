/**
 * @description: Protect endpoints from users that are not authorized with the jwt
 *
 * @description: This is analogous to @login_required in Flask
 *
 * @file authMiddleware.js
 * Author: Ayobami Adebesin
 * @requires jsonwebtoken
 * @requires
 * @exports protect
 */
const jwt = require("jsonwebtoken");
import { Customer } from "../models/customers";
import { Rider } from "../models/riders";
import { ICustomer } from "../models/customers";
import { IRider } from "../models/riders";
import { NextFunction, Request, Response } from "express";

// export interface RequestWithUser extends Request {
//   user: ICustomer | IRider | null;
// }
// Tried to extend the Request interface but it didn't work

declare global {
  namespace Express {
    interface Request {
      rider?: IRider | null;
      customer?: ICustomer | null;
    }
  }
}

const riderRequired = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  /**
   * @description: This function protects endpoints from users that are not authorized with the jwt
   * @description: This is analogous to @jwtrequired() decorator in Flask
   * @param {Object} req - The request object
   * @param {Object} res - The response object
   * @param {Function} next - The next middleware function
   */
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      // Decodes the token and finds the id of the user associated with the token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      if ((await Rider.findById(decoded.id).select("-password")) !== null) {
        const user: IRider | null = await Rider.findById(decoded.id).select(
          "-password"
        );
        req.rider = user;
      } else {
        res
          .status(401)
          .send("Not authorized, token failed. You must be a Rider");
        //throw new Error("Not authorized, token failed. You must be a Customer");
      }
      // If the user is authenticated, then the next function is called
      next();
    } catch (error) {
      console.error(error);
      res.status(401).send("Not authorized, token failed. You must be a Rider");
      throw new Error("Not authorized, token failed. You must be a Rider");
    }
  }
};

export default riderRequired;
