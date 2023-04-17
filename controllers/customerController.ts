import { Customer, ICustomer } from "../models/customers";
import { Request, Response } from "express";
import { generateToken } from "../config/generateToken";
import matchPassword from "../config/validatePassword";

const errMsg1: string = "Please fill all fields";
const errMsg3: string = "Email already exists!";
const errMsg4: string = "Error creating profile. Try again!";
const errMsg5: string = "Invalid email or password";

class customerController {
  static async registerCustomer(req: Request, res: Response) {
    /**
     * @description Register a new customer
     * @param req : Request
     * @param res : Response
     * @returns
     * @route POST /api/v1/customers/signup
     *
     */
    const { name, email, phone, password } = req.body;

    // Check if all fields are filled
    if (!name || !email || !phone || !password) {
      res.status(400).send();
      throw new Error(errMsg1);
    }
    //Check if Customer is already registered
    if ((await Customer.findOne({ email })) !== null) {
      res.status(400).send(errMsg3);
    } else {
      const newCustomer: ICustomer = await Customer.create({
        name: name,
        email: email,
        phone: phone,
        password: password,
      });

      if (newCustomer) {
        const returnObject = {
          _id: newCustomer._id,
          name: newCustomer.name,
          email: newCustomer.email,
          phone: newCustomer.phone,
          message: "Profile created successfully",
        };
        res.status(200).send(returnObject);
      } else {
        res.status(400).send(errMsg4);
        throw new Error(errMsg4);
      }
    }
  }
  static async loginCustomer(req: Request, res: Response) {
    /**
     * @desc    Authenticate and login a Customer
     * @route   POST "/api/v1/customers/login"
     * @access  Public
     * @param   {Object} req - The request object
     * @param   {Object} res - The response object
     * @returns {Object} - Returns a json object with the user's id, name, email, and token
     * @throws  {Error} - Throws an error if the user's email or password is invalid
     * @throws  {Error} - Throws an error if the user's email or password is not provided
     */
    const { email, password } = req.body;
    const user: ICustomer | null = await Customer.findOne({ email });

    if (!email || !password) {
      res.status(400).send(errMsg1);
      throw new Error(errMsg1);
    }

    if (user && (await matchPassword(password, user.password))) {
      res.status(200).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id),
        message: "Login successful",
      });
    } else {
      res.status(401).send(errMsg5);
      throw new Error(errMsg5);
    }
  }
}

export default customerController;
