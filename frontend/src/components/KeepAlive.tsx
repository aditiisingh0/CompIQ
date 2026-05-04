"use client";
import { useEffect } from "react";

const API = "https://compiq.onrender.com";

export default function KeepAlive() {
  useEffect(() => {
    // Ping immediately on page load to wake server
    fetch(`${API}/health`).catch(() => {});

    // Then ping every 4 minutes to prevent cold start
    const interval = setInterval(() => {
      fetch(`${API}/health`).catch(() => {});
    }, 4 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  return null; // renders nothing
}