import { Tooltip, IconButton } from "@mui/material";
import React from "react";
import AssignmentIcon from "@mui/icons-material/Assignment";

interface Props {
  tooltipText: string;
  className: string;
  onClick: () => void;
  disabled: boolean;
  isOpen: boolean;
}

export const CopyToClipboradBtn = ({
  tooltipText,
  className,
  onClick,
  disabled,
  isOpen,
}: Props) => {
  return (
    <Tooltip
      arrow
      open={isOpen}
      title={tooltipText}
      placement="top"
      className={"Tooltip " + className}
      onClose={() => {}}
      onOpen={() => {}}
    >
      <IconButton onClick={onClick} disabled={disabled}>
        <AssignmentIcon color={`${disabled ? "disabled" : "primary"}`} />
      </IconButton>
    </Tooltip>
  );
};
