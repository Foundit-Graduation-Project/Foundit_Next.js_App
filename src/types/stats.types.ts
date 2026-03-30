import React from "react";

export type StatCardProps = {
  title: string;
  value: number | string;
  icon: React.ElementType;
  color: {
    bg: string;
    text: string;
    iconBg: string;
  };
  index: number;
  loading: boolean;
};
