import React from "react";
import { Input } from "antd";
import classNames from "classnames";
import "./style.scss";

interface IRenameableTitleProps {
  isEditing: boolean;
  value: string;
  onChange: (value: string) => void;
  onStartEdit: () => void;
  onEndEdit: () => void;
  titleClassName?: string;
}

export const RenameableTitle = ({
  isEditing,
  value,
  onChange,
  onStartEdit,
  onEndEdit,
  titleClassName
}: IRenameableTitleProps) => {
  return isEditing ? (
    <Input
      autoFocus
      placeholder="Move Name"
      value={value}
      onChange={e => onChange(e.target.value)}
      onBlur={onEndEdit}
      onPressEnter={onEndEdit}
      className="renameableTitle-input"
    />
  ) : (
    <div
      className={classNames("renameableTitle-title", titleClassName)}
      onClick={onStartEdit}
    >
      {value || "Untitled"}
    </div>
  );
};
