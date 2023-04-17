/**
 * @file Rider Model
 * @description Defines the Rider Model
 * @author Ayobami Adebesin
 */
import { Document, Schema, Types, model } from "mongoose";
import { IOrder } from "./orders";
import bcrypt from "bcryptjs";
//Enum for Rider Status
export enum RiderStatus {
  Available = "available",
  Busy = "busy",
  OnBreak = "on_break",
}

// Create interface representing a Rider document
export interface IRider extends Document {
  _id: string;
  name: string;
  email: string;
  phone: string;
  isActive?: boolean;
  password: string;
  isLicensed: boolean;
  current_location?: string;
  status: RiderStatus;
  orders?: Array<IOrder>;
  current_order?: Types.ObjectId;
  created_at: Date;
  updated_at: Date;
}

// Define Rider Schema
const RiderSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    isActive: { type: Boolean, default: true },
    password: { type: String, required: true, trim: true },
    isLicensed: { type: Boolean, required: true, default: true },
    current_location: { type: String, trim: true },
    status: { type: String, enum: RiderStatus, default: RiderStatus.Available },
    orders: [{ type: Schema.Types.ObjectId, ref: "Order" }],
    current_order: { type: Schema.Types.ObjectId, ref: "Order", default: null },
  },
  {
    timestamps: true,
  }
);

RiderSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Create model for Rider Schema
export const Rider = model<IRider>("Rider", RiderSchema);
