'use client';

import React, { ReactNode } from "react";

interface ChartContainerProps {
  children: ReactNode;
  config?: Record<string, any>;
  className?: string;
}

const ChartContainer: React.FC<ChartContainerProps> = ({ children, className }) => {
  return (
    <div className={`p-4 bg-white rounded-md shadow-sm ${className ?? ""}`}>
      {children}
    </div>
  );
};

export default ChartContainer;
