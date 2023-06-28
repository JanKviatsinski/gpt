import { IconButton, TextField } from "@mui/material";
import { Languages } from "globalTypes/languages";
import React from "react";
import { LanguageChooser } from "./LanguageChooser";
import { TranslatedText } from "./TranslatedText";
import KeyboardDoubleArrowDownIcon from "@mui/icons-material/KeyboardDoubleArrowDown";
import BackspaceIcon from "@mui/icons-material/Backspace";
import { ClipboardText } from "./types";
import { CopyToClipboradBtn } from "./CopyToClipboradBtn";

interface Props {
  inputValue: string;
  inputChangeHandler: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  translateLangForOriginalText: Languages | "detected";
  goTranslate: (
    isOriginalTextToTranslate: boolean,
    langToTranslate: Languages | "detected"
  ) => void;
  translatedOriginalText: string;
  clearingInput: () => void;
  copyToClipboard: (text: string, type: ClipboardText) => void;
  tooltipCopyToClipboardIsOpen: boolean;
}

export const LeftPart = ({
  inputValue,
  inputChangeHandler,
  translateLangForOriginalText,
  goTranslate,
  translatedOriginalText,
  clearingInput,
  copyToClipboard,
  tooltipCopyToClipboardIsOpen,
}: Props) => {
  return (
    <div className="flex flex-col items-center">
      <div className="w-full relative">
        <TextField
          className="w-full !mb-3"
          label="Input"
          multiline
          rows={7}
          value={inputValue}
          onChange={inputChangeHandler}
        />
        <IconButton
          className="!absolute top-2 right-2"
          disabled={!inputValue}
          onClick={clearingInput}
        >
          <BackspaceIcon color={`${inputValue ? "primary" : "disabled"}`} />
        </IconButton>
      </div>

      <KeyboardDoubleArrowDownIcon className="mb-3" />
      <LanguageChooser
        title={"Translate original text to:"}
        className="!mb-4 text-center"
        chosenLang={translateLangForOriginalText}
        setLang={(value) => goTranslate(true, value)}
        languages={Object.values(Languages)}
        disabled={!inputValue}
      />

      <div className="w-full relative">
        <TranslatedText
          text={translatedOriginalText}
          label="Translated original text"
        />
        <CopyToClipboradBtn
          isOpen={tooltipCopyToClipboardIsOpen}
          className="!absolute top-2 right-2 p-2"
          tooltipText="Copied!"
          disabled={!translatedOriginalText}
          onClick={() =>
            copyToClipboard(
              translatedOriginalText,
              ClipboardText.translatedOriginalText
            )
          }
        />
      </div>
    </div>
  );
};
