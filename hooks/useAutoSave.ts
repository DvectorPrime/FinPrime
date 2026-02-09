import { useState, useEffect, useRef } from "react";

export function useAutoSave<T>(
  data: T, 
  saveFunction: (data: T) => Promise<void>, 
  delay: number = 1000
) {
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    setStatus("saving");

    const handler = setTimeout(async () => {
      try {
        await saveFunction(data);
        setStatus("saved");
        setTimeout(() => setStatus("idle"), 2000);
      } catch (error) {
        console.error("Auto-save failed", error);
        setStatus("error");
      }
    }, delay);

    return () => clearTimeout(handler);
  }, [data, delay]);

  return status;
}