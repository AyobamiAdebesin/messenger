// Function to generate a token for the user
const jwt = require("jsonwebtoken");

export const generateToken = (id : string) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "3d",
  });
};
