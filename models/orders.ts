/**
 * @file Order model
 * @description Defines the Order Model
 * @author Ayobami Adebesin
 */
import { Schema, model, Types, Document } from "mongoose";
// Enum for Order status
export enum OrderStatus {
  Pending = "PENDING",
  InProgress = "IN_PROGRESS",
  Delivered = "DELIVERED",
  Cancelled = "CANCELLED",
}

// Create interface representing an Order document
export interface IOrder extends Document{
  _id: string;
  order_description: string;
  customer_id: Types.ObjectId;
  rider_id: Types.ObjectId;
  pickup_address: string;
  delivery_address: string;
  status: OrderStatus;
  created_at: Date;
  updated_at: Date;
}

// Create Schema for Order
const OrderSchema = new Schema<IOrder>(
  {
    order_description: { type: String, required: true, trim: true },
    customer_id: {
      type: Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
    },
    rider_id: { type: Schema.Types.ObjectId, ref: "Rider" },
    pickup_address: { type: String, required: true, trim: true },
    delivery_address: { type: String, required: true, trim: true },
    status: { type: String, enum: OrderStatus, default: OrderStatus.Pending },
  },
  {
    timestamps: true,
  }
);

//Create model for Order Schema
export const Order = model<IOrder>("Order", OrderSchema);
