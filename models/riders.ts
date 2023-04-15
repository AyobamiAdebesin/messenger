import { Schema, model } from "mongoose";
import bcrypt from "bcryptjs";
//Enum for Rider Status
enum RiderStatus {
  Available = "available",
  Busy = "busy",
  OnBreak = "on_break",
}

// Create interface representing a Rider document
interface IRider {
  id: string;
  name: string;
  email: string;
  phone: string;
  password: string;
  current_location: string;
  status: RiderStatus;
  created_at: Date;
  updated_at: Date;
}

// Define Rider Schema
const RiderSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    password: { type: String, required: true, trim: true },
    isLicensed: { type: Boolean },
    current_location: { type: String, trim: true },
    status: { type: String, enum: RiderStatus, default: RiderStatus.Available },
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
