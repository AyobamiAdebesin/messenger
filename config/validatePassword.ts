import bcrypt from "bcryptjs";

const matchPassword = async (enteredPassword: string, password: string) => {
  return await bcrypt.compare(enteredPassword, password);
};

export default matchPassword;