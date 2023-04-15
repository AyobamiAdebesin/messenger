/**
 * @description: Protect endpoints from users that are not authorized with the jwt
 * @file authMiddleware.js
 * Author: Ayobami Adebesin
 * @requires jsonwebtoken
 * @requires
 * @exports protect
 */
const jwt = require("jsonwebtoken");
import { Customer } from "../models/customers";
import { Rider } from "../models/riders";

const protect = async (req:any, res:any, next: any) => {
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
      if ((await Customer.findById(decoded.id).select("-password")) !== null) {
        req['user'] = await Customer.findById(decoded.id).select("-password");
      } else if (
        (await Rider.findById(decoded.id).select("-password")) !== null
      ) {
        req['user'] = await Rider.findById(decoded.id).select("-password");
      }
      // If the user is authenticated, then the next function is called
      next();
    } catch (error) {
      console.error(error);
      res.status(401).send("Not authorized, token failed");
      throw new Error("Not authorized, token failed");
    }
  }
};

export default protect;
