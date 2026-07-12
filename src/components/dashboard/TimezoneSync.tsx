"use client";

import { useEffect } from "react";
import { updateUserTimezoneAction } from "@/app/dashboard/meeting/actions";
import { getBrowserTimeZone } from "@/lib/meeting-format";

export default function TimezoneSync() {
  useEffect(() => {
    const timeZone = getBrowserTimeZone();
    void updateUserTimezoneAction(timeZone);
  }, []);

  return null;
}
