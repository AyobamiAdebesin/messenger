import { Rider } from "../models/riders";
import { Request, Response } from "express";
import { generateToken } from "../config/generateToken";
import matchPassword from "../config/validatePassword";

const errMsg1: string = "Please fill all fields";
const errMsg2: string = "You need to be licensed to be a rider";
const errMsg3: string = "Email already exists!";
const errMsg4: string = "Error creating profile. Try again!";
const errMsg5: string = "Invalid email or password";

class riderController {
  static async registerRider(req: Request, res: Response) {
    /**
     * @description Register a new rider
     * @param req : Request
     * @param res : Response
     * @returns
     * @route POST /api/users/register_rider
     */
    const { name, email, phone, password, isLicensed } = req.body;

    if (!name || !email || !phone || !password || !isLicensed) {
      res.status(400).send(errMsg1);
      throw new Error(errMsg1);
    }
    if (isLicensed === false) {
      res.send(400).send(errMsg2);
      throw new Error(errMsg2);
    }
    //Check if rider is already registered
    if ((await Rider.findOne({ email })) !== null) {
      res.status(400).send(errMsg3);
    } else {
      const newRider = await Rider.create({
        name: name,
        email: email,
        phone: phone,
        password: password,
      });

      if (newRider) {
        const returnObject = {
          _id: newRider._id,
          name: newRider.name,
          email: newRider.email,
          phone: newRider.phone,
          token: generateToken(newRider._id),
        };

        res.status(200).send(returnObject);
      } else {
        res.status(400).send(errMsg4);
        throw new Error(errMsg4);
      }
    }
  }

  static async loginRider(req: Request, res: Response) {
    /**
     * @desc    Authenticate and login a Rider
     * @route   POST "/api/users/rider_login
     * @access  Public
     * @param   {Object} req - The request object
     * @param   {Object} res - The response object
     * @returns {Object} - Returns a json object with the user's id, name, email, and token
     * @throws  {Error} - Throws an error if the user's email or password is invalid
     * @throws  {Error} - Throws an error if the user's email or password is not provided
     */
    const { email, password } = req.body;
    const user = await Rider.findOne({ email });

    if (!email || !password) {
      res.status(400).send(errMsg1);
      throw new Error(errMsg1);
    }

    if (user && (await matchPassword(password, user.password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).send(errMsg5);
      throw new Error(errMsg5);
    }
  }
}
export default riderController;
