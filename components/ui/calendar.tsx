"use client";

import React from "react";
import { DayPicker } from "react-day-picker";
import { ChevronLeft, ChevronRight } from "lucide-react";
import "react-day-picker/dist/style.css";

function CustomNav(props: React.HTMLAttributes<HTMLDivElement> & {
  onPreviousClick?: React.MouseEventHandler<HTMLButtonElement>;
  onNextClick?: React.MouseEventHandler<HTMLButtonElement>;
}) {
  const { onPreviousClick, onNextClick, ...rest } = props;

  return (
    <div
      {...rest}
      style={{
        display: "flex",
        justifyContent: "space-between",
        padding: "0 1rem",
        ...props.style,
      }}
    >
      <button
        type="button"
        onClick={onPreviousClick}
        aria-label="Previous Month"
        style={{ background: "none", border: "none", cursor: "pointer" }}
      >
        <ChevronLeft size={24} />
      </button>
      <button
        type="button"
        onClick={onNextClick}
        aria-label="Next Month"
        style={{ background: "none", border: "none", cursor: "pointer" }}
      >
        <ChevronRight size={24} />
      </button>
    </div>
  );
}

export default function MyCalendar() {
  return (
    <div style={{ maxWidth: 350, margin: "auto" }}>
      <DayPicker
        components={{
          Nav: CustomNav,
        }}
      />
    </div>
  );
}
