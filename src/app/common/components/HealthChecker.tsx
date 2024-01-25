"use client";
import { healthCheck } from "@/services/axios";
import React, { memo, useEffect, useRef, useState } from "react";

const HealthCheckerComp = () => {
  const timerRef = useRef<any>(null);

  useEffect(() => {
    timerRef.current = setInterval(async () => {
      console.log("Health check");
      await healthCheck();
    }, 45000);

    return () => {
      clearInterval(timerRef.current);
    };
  }, []);

  return null;
};

export const HealthChecker = memo(HealthCheckerComp);
