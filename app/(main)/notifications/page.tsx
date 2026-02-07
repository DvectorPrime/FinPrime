"use client";

import ComingSoon from "@/components/ComingSoon";
import { useMenu } from "@/context/menuContext";
import { useEffect } from "react";
import { useRouter} from "next/navigation"
import { useAuth } from "@/context/authContext";
import { LuBellRing } from "react-icons/lu";

export default function NotificationsPage() {
  const {setMenuShowing} = useMenu()

  const { user, loading: authLoading } = useAuth();
    
  const router = useRouter();
  
  useEffect(() => {
      if (!authLoading && !user) {
        router.push("/login");
      }
    }, [user, authLoading, router]);
  

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