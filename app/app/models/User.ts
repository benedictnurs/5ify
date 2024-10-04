// models/User.ts
import mongoose, { Document, Schema, Model } from 'mongoose';

export interface IUser extends Document {
  authorId: string;
  tasks: string; // Stores tasks as a JSON string
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema<IUser> = new Schema(
  {
    authorId: {
      type: String,
      required: true,
      unique: true,
    },
    tasks: { // New field to store tasks as a JSON string
      type: String,
      required: false, // Optional on creation
      default: '[]', // Defaults to an empty array string
    },
  },
  {
    timestamps: true, // Automatically manages createdAt and updatedAt fields
  }
);

// Prevent model overwrite during hot-reloading in development
const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default User;
