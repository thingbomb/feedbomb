"use client";

import { useEffect, useState } from "react";

export default function ReadHistory(props) {
  useEffect(() => {
    let readHistory = JSON.parse(localStorage.getItem("readHistory"));
    if (readHistory) {
      if (readHistory.indexOf(props.data) == -1) {
        readHistory.push(props.data);
        localStorage.setItem("readHistory", JSON.stringify(readHistory));
      }
    } else {
      localStorage.setItem("readHistory", JSON.stringify([props.data]));
    }

    return () => {
      readHistory = [];
    };
  }, []);
  return <div></div>;
}
