/**
 * @file Third Party Logistics(3PL) Company Model
 * @description Defines the (3PL) Company Model
 * @author Ayobami Adebesin
 */
import { Document, Schema, Types, model } from "mongoose";
import bcrypt from "bcryptjs";
import { IOrder } from "./orders";

export enum PricingType {
    Distance = "DISTANCE",
    Weight = "WEIGHT",
    Time = "TIME",
    Flat = "FLAT",
    Volume = "VOLUME",
}
    
// Create interface representing a Customer document
export interface IThirdParty extends Document {
  _id: string;
  name: string;
  address?: string;
  contactPerson?: string;
  contactEmail: string;
  contactPhone: string;
  password: string;
  orders?: Array<IOrder>;
  pricing?: PricingType;
  created_at: Date;
  updated_at: Date;
}

// Create Schema for Customer
const ThirdPartySchema = new Schema<IThirdParty>(
  {
    name: { type: String, required: true, trim: true },
    address: { type: String, trim: true, default: "My Company Address" },
    contactPerson: { type: String, trim: true, default: "My Company Contact" },
    contactEmail: { type: String, required: true, trim: true },
    contactPhone: { type: String, required: true, trim: true },
    password: { type: String, required: true, trim: true },
    orders: [{ type: Schema.Types.ObjectId, ref: "Order" }],
    pricing: { type: String, enum: PricingType, default: PricingType.Flat },
  },
  {
    timestamps: true,
  }
);

// This is a pre-save hook. It will run before the user is saved to the database.
// It will hash the user's password before saving it to the database.
// This will ensure that the password is never saved as plain text.
// This hook will only run if the password field has been modified.
ThirdPartySchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Create a model
export const ThirdParty = model<IThirdParty>("ThirdParty", ThirdPartySchema);