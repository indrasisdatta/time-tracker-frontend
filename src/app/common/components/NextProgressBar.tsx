"use client";
import React, { useState, useEffect } from "react";
// import NextNProgress from "nextjs-progressbar";
import { Router } from "next/router";

export const NextProgressBar = () => {
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const start = () => {
      setIsLoading(true);
    };
    const end = () => {
      setIsLoading(false);
    };
    Router.events.on("routeChangeStart", start);
    Router.events.on("routeChangeComplete", end);
    Router.events.on("routeChangeError", end);
    return () => {
      Router.events.off("routeChangeStart", start);
      Router.events.off("routeChangeComplete", end);
      Router.events.off("routeChangeError", end);
    };
  }, []);

  console.log("Next route loading state", isLoading);

  //   return (
  //     <NextNProgress
  //       color="#29D"
  //       startPosition={0.5}
  //       stopDelayMs={200}
  //       height={30}
  //       showOnShallow={true}
  //     />
  //   );
};
