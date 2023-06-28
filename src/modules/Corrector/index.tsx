import { Alert, Button } from "@mui/material"
import { Languages } from "globalTypes/languages"
import { OpenAIApi } from "openai"
import React, { useEffect, useState } from "react"
import { commandEnterListenener } from "utils/commandEnterListenener"
import { LanguageChooser } from "./LanguageChooser"
import Backdrop from "@mui/material/Backdrop"
import CircularProgress from "@mui/material/CircularProgress"
import { LeftPart } from "./LeftPart"
import { RightPart } from "./RightPart"
import { ClipboardText } from "./types"
import { Link } from "react-router-dom"
import { PageNames } from "globalTypes/routing"
import { useTranslation } from "react-i18next"

interface Props {
  openai: OpenAIApi
}

export const Corrector = ({ openai }: Props) => {
  const { t } = useTranslation()
  const [inputValue, setInputValue] = useState("")
  const [correctedResult, setCorrectedResult] = useState("")
  const [langToCorrect, setLangToCorrect] = useState<Languages | "detected">(
    "detected"
  )
  const [downloading, setDownloading] = useState(false)
  const [isError, setIsError] = useState(false)

  const [translateLangForOriginalText, setTranslateLangForOriginalText] =
    useState<Languages | "detected">("detected")
  const [translateLangForCorrectedText, setTranslateLangForCorrectedText] =
    useState<Languages | "detected">("detected")

  const [translatedOriginalText, setTranslatedOriginalText] = useState("")
  const [translatedCorrectedText, setTranslatedCorrectedText] = useState("")
  const [isCopiedToClipboard, setIsCopiedToClipboard] = useState<{
    [key in ClipboardText]: boolean
  }>({
    correctedResult: false,
    translatedCorrectedText: false,
    translatedOriginalText: false,
  })

  // useEffect(() => {
  //   // to fix
  //   commandEnterListenener(() => {
  //     console.log(inputValue, "inputValue");
  //     inputValue.length > 4 && goCorrecting();
  //   });
  // }, []);
  // commandEnterListenener(() => {
  //   console.log(inputValue, "inputValue");
  //   inputValue.length > 4 && goCorrecting();
  // });

  useEffect(() => {
    setTranslateLangForOriginalText("detected")
    setTranslatedOriginalText("")
    setCorrectedResult("")
    setTranslatedCorrectedText("")
    setTranslateLangForCorrectedText("detected")
  }, [inputValue])

  const inputChangeHandler = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const value = e.target.value
    setInputValue(value)
  }

  const goCorrecting = async () => {
    const langPhrase =
      langToCorrect !== "detected" ? ` in ${langToCorrect}` : ""
    if (inputValue) {
      try {
        setDownloading(true)
        const completion = await openai.createCompletion({
          model: "text-davinci-003",
          prompt: `Make the following text more correct${langPhrase}: ${inputValue}.`,
          temperature: 1,
          max_tokens: 256,
          top_p: 1,
          frequency_penalty: 0,
          presence_penalty: 0,
        })
        setDownloading(false)
        setTranslateLangForCorrectedText("detected")
        setTranslatedCorrectedText("")

        completion.data.choices[0].text &&
          setCorrectedResult(completion.data.choices[0].text)
      } catch {
        setIsError(true)
      }
    }
  }

  const goTranslate = async (
    isOriginalTextToTranslate: boolean,
    langToTranslate: Languages | "detected"
  ) => {
    if (isOriginalTextToTranslate) {
      setTranslateLangForOriginalText(langToTranslate)
    } else {
      setTranslateLangForCorrectedText(langToTranslate)
    }

    if (
      //   (langToTranslate !== "detected" &&
      //   isOriginalTextToTranslate &&
      //   inputValue) ||
      // (!isOriginalTextToTranslate && correctedResult)
      langToTranslate !== "detected"
    ) {
      setDownloading(true)
      try {
        const completion = await openai.createCompletion({
          model: "text-davinci-003",
          prompt: `Translate the following text to ${langToTranslate}: ${isOriginalTextToTranslate ? inputValue : correctedResult
            }.`,
          temperature: 1,
          max_tokens: 256,
          top_p: 1,
          frequency_penalty: 0,
          presence_penalty: 0,
        })
        setDownloading(false)

        const text = completion.data.choices[0].text
        if (isOriginalTextToTranslate) {
          text && setTranslatedOriginalText(text)
        } else {
          text && setTranslatedCorrectedText(text)
        }
      } catch {
        setIsError(true)
      }
    }
  }

  const copyToClipboard = (text: string, type: ClipboardText) => {
    navigator.clipboard
      .writeText(text)
      .then(function () {
        const newState: { [key in ClipboardText]: boolean } = {
          ...isCopiedToClipboard,
        }

        Object.keys(newState).map((key) => {
          if (key === type) {
            newState[key] = true
          }
        })

        setIsCopiedToClipboard(newState)
        setTimeout(() => {
          const newState2: { [key in ClipboardText]: boolean } = {
            ...isCopiedToClipboard,
          }
          Object.keys(newState2).map((key) => {
            newState2[key as ClipboardText] = false
          })
          setIsCopiedToClipboard(newState2)
          console.log(newState2)
        }, 2000)
      })
      .catch(function (error) {
        console.error("Unable to copy text to clipboard: ", error)
      })
  }

  return (
    <div className="flex flex-col">
      <div className="pb-5 text-blue-500 underline">
        <Link to={"/" + PageNames.interlocutor}>{`${t("to")} ${t(
          "interlocutor"
        )} `}</Link>
      </div>
      <LanguageChooser
        title={"Choose language for corrected text"}
        className="!mb-4"
        chosenLang={langToCorrect}
        setLang={(value) => setLangToCorrect(value)}
        languages={Object.values(Languages)}
        detectedLang
      />
      <div className="grid grid-cols-[1fr_0.3fr_1fr] gap-4">
        <LeftPart
          copyToClipboard={copyToClipboard}
          inputValue={inputValue}
          inputChangeHandler={inputChangeHandler}
          translateLangForOriginalText={translateLangForOriginalText}
          goTranslate={goTranslate}
          translatedOriginalText={translatedOriginalText}
          clearingInput={() => setInputValue("")}
          tooltipCopyToClipboardIsOpen={
            isCopiedToClipboard.translatedOriginalText
          }
        />
        <Button
          variant="contained"
          className="self-start"
          onClick={goCorrecting}
        >
          DO
        </Button>
        <RightPart
          copyToClipboard={copyToClipboard}
          correctedResult={correctedResult}
          translateLangForCorrectedText={translateLangForCorrectedText}
          goTranslate={goTranslate}
          langToCorrect={langToCorrect}
          translatedCorrectedText={translatedCorrectedText}
          isOpenCopyCorrectedResultToClipboardTooltip={
            isCopiedToClipboard.correctedResult
          }
          isOpenCopyTranslatedCorrectedResultToClipboardTooltip={
            isCopiedToClipboard.translatedCorrectedText
          }
        />
      </div>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={downloading || isError}
        onClick={() => setIsError(false)}
      >
        {isError ? (
          <Alert severity="error">
            Something went wrong! Please try again or contact support.
          </Alert>
        ) : (
          <CircularProgress color="inherit" />
        )}
      </Backdrop>
    </div>
  )
}
