import React from "react";
import TextField from "@mui/material/TextField";

interface Props {
  text: string;
  label: string;
}

export const TranslatedText = ({ text, label }: Props) => {
  return (
    <TextField
      className="w-full"
      label={label}
      multiline
      rows={8}
      value={text}
    />
  );
};
