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
  displaySuffix?: React.ReactNode;
}

export const RenameableTitle = ({
  isEditing,
  value,
  onChange,
  onStartEdit,
  onEndEdit,
  titleClassName,
  displaySuffix
}: IRenameableTitleProps) => {
  return isEditing ? (
    <div className="renameableTitle-input-wrapper">
      <Input
        autoFocus
        placeholder="Move Name"
        value={value}
        onChange={e => onChange(e.target.value)}
        onBlur={onEndEdit}
        onPressEnter={onEndEdit}
        className="renameableTitle-input"
      />
    </div>
  ) : (
    <div
      className={classNames("renameableTitle-title", titleClassName)}
      onClick={onStartEdit}
      title={value}
    >
      <div className="renameableTitle-title-value">{value || "Untitled"}</div>
      <span className="renameableTitle-title-suffix">{displaySuffix}</span>
    </div>
  );
};
