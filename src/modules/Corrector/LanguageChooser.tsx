import React, { ChangeEvent } from "react";
import { FormControlLabel, Radio, RadioGroup } from "@mui/material";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import { Languages } from "globalTypes/languages";

interface Props {
  languages: Languages[];
  chosenLang: Languages | "detected";
  title: string;
  setLang: (value: Languages | "detected") => void;
  detectedLang?: boolean;
  className?: string;
  disabled?: boolean;
}

/**
 * Component for choosing the output language for text.
 */
export const LanguageChooser = ({
  languages,
  detectedLang,
  chosenLang,
  setLang,
  title,
  className,
  disabled,
}: Props) => {
  /**
   * Event handler for radio button selection change.
   * @param e - ChangeEvent object
   */
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setLang(e.target.value as Languages | "detected");
  };

  /**
   * Generate radio button for each language option.
   * @param lang - Language option
   * @returns Radio button element
   */
  const makeLangRadio = (lang: Languages) => {
    const capitalizeName = lang.replace(/\b\w/g, (match) =>
      match.toUpperCase()
    );
    return (
      <FormControlLabel
        key={lang}
        value={lang}
        control={<Radio />}
        label={capitalizeName}
      />
    );
  };

  return (
    <FormControl className={"LanguageChooser " + className} disabled={disabled}>
      <FormLabel>{title}</FormLabel>
      <RadioGroup row onChange={handleChange} value={chosenLang}>
        <>
          {detectedLang && (
            <FormControlLabel
              value="detected"
              control={<Radio />}
              label="Detected"
            />
          )}
          {languages.map((lang) => makeLangRadio(lang))}
        </>
      </RadioGroup>
    </FormControl>
  );
};
