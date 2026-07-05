import { Schema, model, models } from "mongoose";

export type TransactionDocument = {
  time: Date;
  amount: string;
  successful: boolean;
};

export type UserDocument = {
  name?: string;
  mail: string;
  level: string;
  transactions: TransactionDocument[];
};

const transactionSchema = new Schema<TransactionDocument>(
  {
    time: { type: Date, required: true, default: Date.now },
    amount: { type: String, required: true },
    successful: { type: Boolean, required: true },
  },
  { _id: false },
);

const userSchema = new Schema<UserDocument>(
  {
    name: { type: String, required: false },
    mail: { type: String, required: true, unique: true, lowercase: true },
    level: { type: String, required: true, default: "NoPay" },
    transactions: { type: [transactionSchema], default: [] },
  },
  { timestamps: true },
);

export const User = models.User ?? model<UserDocument>("User", userSchema);
