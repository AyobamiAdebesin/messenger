/**
 * @description: Protect endpoints from users that are not authorized with the jwt
 *
 * @file thirdpartyAuthMiddleware.ts
 * Author: Ayobami Adebesin
 * @requires jsonwebtoken
 * @exports thirdPartyRequired
 */
const jwt = require("jsonwebtoken");
import { IThirdParty } from "../models/thirdParty";
import { ThirdParty } from "../models/thirdParty";
import { NextFunction, Request, Response } from "express";

const thirdPartyRequired = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  /**
   * @description: This function protects endpoints that are designed for third party users
   * @description: In reality, this type of authentication can be outsourced to a third party service
   * @description: So if the call to an endpoint is made, and that call is not from an internal address,
   * @description: we route the token passed to the third party service
   * @description: and if the token is valid, then we proceed with the request.
   * @description: We can also build an software that can be used to restrict access to certain endpoints for third party users
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
      if (
        (await ThirdParty.findById(decoded.id).select("-password")) !== null
      ) {
        const user: IThirdParty | null = await ThirdParty.findById(
          decoded.id
        ).select("-password");
        req.thirdParty = user;
      } else {
        res
          .status(401)
          .send("Not authorized, token failed. You must be a Third Party User");
        //throw new Error("Not authorized, token failed. You must be a Third Party User");
      }

      // If the user is authenticated, then the next function is called
      next();
    } catch (error) {
      console.error(error);
      res
        .status(401)
        .send("Not authorized, token failed. You must be a Third Party User");
      throw new Error("Not authorized, token failed. You must be a Third Party User");
    }
  }
};

export default thirdPartyRequired;
