"use client";

import ComingSoon from "@/components/ComingSoon";
import { useMenu } from "@/context/menuContext";
import { useEffect } from "react";
import { LuBellRing } from "react-icons/lu";

export default function NotificationsPage() {
  const {setMenuShowing} = useMenu()

  useEffect(() => {
    setMenuShowing(false)
  }, [setMenuShowing])
  return (
    <ComingSoon 
      title="Notification Center"
      description="Soon you will be able to see custom alerts for budget limits, bill reminders, and weekly spending summaries right here."
      icon={LuBellRing}
    />
  );
}