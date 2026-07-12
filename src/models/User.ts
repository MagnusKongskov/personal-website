import { Schema, model, models } from "mongoose";

export type TransactionDocument = {
  time: Date;
  amount: string;
  successful: boolean;
  stripeSessionId?: string;
};

export type UserDocument = {
  name?: string;
  mail: string;
  level: string;
  profilePicture?: string;
  transactions: TransactionDocument[];
  scheduledMeetingAt?: Date;
  meetingSlotId?: string;
  meetingJoinUrl?: string;
  zoomMeetingId?: string;
  meetingReminderSent?: boolean;
  timezone?: string;
  levelUpdatedAt?: Date;
  userAgreedToWebpageDate?: Date;
  webpageAgreementPdf?: Buffer;
  createdAt?: Date;
  updatedAt?: Date;
};

const transactionSchema = new Schema<TransactionDocument>(
  {
    time: { type: Date, required: true, default: Date.now },
    amount: { type: String, required: true },
    successful: { type: Boolean, required: true },
    stripeSessionId: { type: String, required: false },
  },
  { _id: false },
);

const userSchema = new Schema<UserDocument>(
  {
    name: { type: String, required: false },
    mail: { type: String, required: true, unique: true, lowercase: true },
    level: { type: String, required: true, default: "NoPay" },
    profilePicture: { type: String, required: false },
    transactions: { type: [transactionSchema], default: [] },
    scheduledMeetingAt: { type: Date, required: false },
    meetingSlotId: { type: String, required: false },
    meetingJoinUrl: { type: String, required: false },
    zoomMeetingId: { type: String, required: false },
    meetingReminderSent: { type: Boolean, required: false, default: false },
    timezone: { type: String, required: false },
    levelUpdatedAt: { type: Date, required: false },
    userAgreedToWebpageDate: { type: Date, required: false },
    webpageAgreementPdf: { type: Buffer, required: false },
  },
  { timestamps: true },
);

export const User = models.User ?? model<UserDocument>("User", userSchema);
