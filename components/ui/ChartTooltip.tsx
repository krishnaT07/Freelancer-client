'use client';

import React from "react";
import type { TooltipProps } from "recharts";
import type { ValueType, NameType } from "recharts/types/component/DefaultTooltipContent";

interface PayloadItem {
  name: string;
  value: any;
  color?: string;
}

interface ChartTooltipContentProps extends TooltipProps<ValueType, NameType> {
  hideLabel?: boolean;
  payload?: PayloadItem[];  // override optional payload with correct type
  label?: string | number;  // override label type
}

export const ChartTooltipContent: React.FC<ChartTooltipContentProps> = ({
  active,
  payload,
  label,
  hideLabel,
}) => {
  if (!active || !payload || payload.length === 0) return null;

  return (
    <div className="bg-white p-2 rounded shadow border border-gray-200 text-sm">
      {!hideLabel && <div className="font-bold mb-1">{label}</div>}
      {payload.map((entry, idx) => (
        <div key={idx} style={{ color: entry.color }}>
          {entry.name}: {entry.value}
        </div>
      ))}
    </div>
  );
};



