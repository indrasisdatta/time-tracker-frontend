"use client";
import { healthCheck } from "@/services/axios";
import React, { useEffect, useRef, useState } from "react";

export const HealthChecker = () => {
  const timerRef = useRef<any>(null);

  useEffect(() => {
    timerRef.current = setInterval(async () => {
      console.log("Health check");
      await healthCheck();
    }, 30000);

    return () => {
      clearInterval(timerRef.current);
    };
  }, []);

  return null;
};
