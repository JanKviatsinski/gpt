import { TextField } from "@mui/material";
import { Languages } from "globalTypes/languages";
import React from "react";
import { LanguageChooser } from "./LanguageChooser";
import { TranslatedText } from "./TranslatedText";
import KeyboardDoubleArrowDownIcon from "@mui/icons-material/KeyboardDoubleArrowDown";
import { ClipboardText } from "./types";
import { CopyToClipboradBtn } from "./CopyToClipboradBtn";

interface Props {
  correctedResult: string;
  translateLangForCorrectedText: Languages | "detected";
  goTranslate: (
    isOriginalTextToTranslate: boolean,
    langToTranslate: Languages | "detected"
  ) => void;
  langToCorrect: Languages | "detected";
  translatedCorrectedText: string;
  copyToClipboard: (text: string, type: ClipboardText) => void;
  isOpenCopyCorrectedResultToClipboardTooltip: boolean;
  isOpenCopyTranslatedCorrectedResultToClipboardTooltip: boolean;
}

export const RightPart = ({
  correctedResult,
  translateLangForCorrectedText,
  goTranslate,
  langToCorrect,
  translatedCorrectedText,
  copyToClipboard,
  isOpenCopyCorrectedResultToClipboardTooltip,
  isOpenCopyTranslatedCorrectedResultToClipboardTooltip,
}: Props) => {
  return (
    <div className="flex flex-col items-center">
      <div className="w-full relative">
        <TextField
          className="w-full !mb-3"
          label="Corrected text"
          multiline
          rows={7}
          value={correctedResult}
        />
        <CopyToClipboradBtn
          isOpen={isOpenCopyCorrectedResultToClipboardTooltip}
          tooltipText="Copied!"
          className="!absolute top-2 right-2 p-2"
          disabled={!correctedResult}
          onClick={() =>
            copyToClipboard(correctedResult, ClipboardText.correctedResult)
          }
        />
      </div>
      <KeyboardDoubleArrowDownIcon className="mb-3" />
      <LanguageChooser
        title={"Translate corrected text to:"}
        className="!mb-4 text-center"
        chosenLang={translateLangForCorrectedText}
        setLang={(value) => goTranslate(false, value)}
        languages={Object.values(Languages).filter(
          (lang) => lang !== langToCorrect
        )}
        disabled={!correctedResult}
      />
      <div className="w-full relative">
        <TranslatedText
          text={translatedCorrectedText}
          label="Translated corrected text"
        />
        <CopyToClipboradBtn
          isOpen={isOpenCopyTranslatedCorrectedResultToClipboardTooltip}
          tooltipText="Copied!"
          className="!absolute top-2 right-2 p-2"
          disabled={!translatedCorrectedText}
          onClick={() =>
            copyToClipboard(
              translatedCorrectedText,
              ClipboardText.translatedCorrectedText
            )
          }
        />
      </div>
    </div>
  );
};
