import React from "react";
import { Select } from "antd";

const OPTIONS = [1, 2, 3].map(n => ({ value: n, label: n }));

interface IMemberNumSelectProps {
  value?: number;
  onChange?: (val: number) => void;
  className?: string;
  style?: React.CSSProperties;
}

export const MemberNumSelect = ({
  value,
  onChange,
  className,
  style
}: IMemberNumSelectProps) => (
  <Select
    value={value}
    options={OPTIONS}
    onChange={onChange}
    className={className}
    style={style ?? { width: 64 }}
  />
);
