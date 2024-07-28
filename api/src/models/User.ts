import { Schema, model, Document, ObjectId } from "mongoose";

export interface IUser extends Document {
  _id: ObjectId;
  username: string;
  email: string;
  password: string;
}

const userSchema = new Schema<IUser>({
  username: { type: String, required: true, unique: true, index: true },
  email: { type: String, required: true, unique: true, index: true },
  password: { type: String, required: true, minlength: 8 },
});

const User = model<IUser>("User", userSchema);

export default User;
