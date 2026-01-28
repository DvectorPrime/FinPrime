"use client";

import ComingSoon from "@/components/ComingSoon";
import { LuBellRing } from "react-icons/lu";

export default function NotificationsPage() {
  return (
    <ComingSoon 
      title="Notification Center"
      description="Soon you will be able to see custom alerts for budget limits, bill reminders, and weekly spending summaries right here."
      icon={LuBellRing}
    />
  );
}