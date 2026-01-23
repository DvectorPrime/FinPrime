"use client"; // Marks this as client-side code
import { useState, useEffect } from "react";

export default function useWindowWidth() {
  // 1. Initialize with 0 (or a default width) so the server can render without crashing
  const [width, setWidth] = useState(0);

  useEffect(() => {
    // 2. This code runs ONLY in the browser, where 'window' exists
    const handleResize = () => setWidth(window.innerWidth);

    // Set the actual width immediately upon mounting
    handleResize();

    // Add event listener for resizing
    window.addEventListener("resize", handleResize);

    // Cleanup listener on unmount
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return width;
}