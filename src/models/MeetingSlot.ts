import { Schema, model, models } from "mongoose";
import {
  MEETING_SLOT_TYPES,
  type MeetingSlotType,
} from "@/lib/meeting-config";

export type MeetingSlotDocument = {
  _id?: unknown;
  startTime: Date;
  bookedBy?: string;
  bookedAt?: Date;
  batchId?: string;
  hidden?: boolean;
  slotType?: MeetingSlotType;
  meetingJoinUrl?: string;
  zoomMeetingId?: string;
};

const meetingSlotSchema = new Schema<MeetingSlotDocument>(
  {
    startTime: { type: Date, required: true, unique: true },
    bookedBy: { type: String, required: false, lowercase: true },
    bookedAt: { type: Date, required: false },
    batchId: { type: String, required: false },
    hidden: { type: Boolean, required: false, default: false },
    slotType: {
      type: String,
      enum: MEETING_SLOT_TYPES,
      required: false,
      default: "normal",
    },
    meetingJoinUrl: { type: String, required: false },
    zoomMeetingId: { type: String, required: false },
  },
  { timestamps: true },
);

export const MeetingSlot =
  models.MeetingSlot ??
  model<MeetingSlotDocument>("MeetingSlot", meetingSlotSchema);
