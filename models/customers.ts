import { Schema, model } from "mongoose";
import bcrypt from "bcryptjs";
// Create interface representing a Customer document
interface ICustomer {
  id: string;
  name: string;
  email: string;
  phone: string;
  password: string;
  created_at: Date;
  updated_at: Date;
}

// Create Schema for Customer
const CustomerSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    password: { type: String, required: true, trim: true },
  },
  {
    timestamps: true,
  }
);

// This is a pre-save hook. It will run before the user is saved to the database.
// It will hash the user's password before saving it to the database.
// This will ensure that the password is never saved as plain text.
// This hook will only run if the password field has been modified.
CustomerSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Create a model
export const Customer = model<ICustomer>("Customer", CustomerSchema);
