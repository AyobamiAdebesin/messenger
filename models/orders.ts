import { Schema, model } from "mongoose";
// Enum for Order status
enum OrderStatus {
  Pending = "pending",
  InProgress = "in_progress",
  Delivered = "delivered",
  Cancelled = "cancelled",
}

// Create interface representing an Order document
interface IOrder {
  id: string;
  customer_id: string;
  rider_id: string;
  pickup_address: string;
  delivery_address: string;
  status: OrderStatus;
  created_at: Date;
  updated_at: Date;
}

// Create Schema for Order
const OrderSchema = new Schema(
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
