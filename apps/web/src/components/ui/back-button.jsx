"use client";

import { ChevronLeft } from "lucide-react";
import { Button } from "./button";

export default function BackButton() {
  return (
    <Button variant="outline" size="icon" onClick={() => history.back()}>
      <ChevronLeft className="h-[1.2rem] w-[1.2rem]" />
    </Button>
  );
}
