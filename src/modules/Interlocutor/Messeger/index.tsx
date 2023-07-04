import { Button } from "@mui/base"
import CircularProgress from "@mui/material/CircularProgress"
import React, { useEffect, useRef, useState } from "react"
import { CorrespondenceInterface } from "../types"
import { ListeningOptions } from "react-speech-recognition"
import { IconButton } from "@mui/material"

import VoiceOverOffIcon from "@mui/icons-material/VoiceOverOff"
import MicIcon from '@mui/icons-material/Mic'
import HearingIcon from '@mui/icons-material/Hearing'
import MicOffIcon from '@mui/icons-material/MicOff'
interface Props {
  messeges: CorrespondenceInterface[]
  isGptThinking: boolean
  transcript: string
  listening: boolean
  startListening: (options?: ListeningOptions | undefined) => Promise<void>
  stopSpeaking: () => void
  isGptTalking: boolean
  browserSupportsContinuousListening: boolean
  stopListening: () => Promise<void>
  manuallyStartMicrophone: () => void
}

export const Messeger = ({
  messeges,
  isGptThinking,
  startListening,
  listening,
  transcript,
  isGptTalking,
  stopSpeaking,
  browserSupportsContinuousListening,
  stopListening,
  manuallyStartMicrophone
}: Props) => {
  const ulRef = useRef<HTMLUListElement | null>(null)
  const [userInputText, setUserInputText] = useState(transcript)


  useEffect(() => {
    if (ulRef.current) {
      const element = ulRef.current
      element.scrollTop = element.scrollHeight
    }
    setUserInputText('')
  }, [messeges])

  const liClassName =
    "flex flex-col mb-2 rounded p-3 w-[48%] max-w-[450px] items-end"
  const userLiClassName = "text-right bg-blue-800 text-white self-end"
  const gptLiClassName = "bg-blue-200 self-start"
  return (
    <ul
      ref={ulRef}
      className=" flex flex-col border-blue-500 py-2 pl-2 pr-4 border rounded max-h-[80vh] overflow-y-auto w-full max-w-[900px] self-center"
    >
      {messeges.map((msg, i) => (
        <li
          className={`${liClassName} ${msg.role === "user" ? userLiClassName : gptLiClassName
            }`}
        >
          {msg.message}
          <div className="min-h-[40px]">
            {msg.role === "gpt" &&
              i === messeges.length - 1 &&
              isGptTalking && (
                <IconButton onClick={stopSpeaking}>
                  <VoiceOverOffIcon
                  />
                </IconButton>
              )}
          </div>
        </li>
      ))}
      {isGptThinking ? (
        <li className={`${liClassName} ${gptLiClassName}`}>
          <CircularProgress color="inherit" />
        </li>
      ) : (
        <li className={`${liClassName} ${userLiClassName}`}>
          {userInputText}
          <div className='flex'>
            {/* auto mic */}
            <IconButton
              onClick={() => startListening()}
              disabled={listening || isGptTalking}
            >
              <HearingIcon
                fontSize="large"
                style={{ color: `${listening || isGptTalking ? "" : 'white'}` }}
              />
            </IconButton>
            {browserSupportsContinuousListening && <>
              {/* manuale mic */}
              <IconButton

                onClick={() => manuallyStartMicrophone()}
                disabled={listening || isGptTalking}
              >
                <MicIcon
                  fontSize="large"
                  style={{ color: `${listening || isGptTalking ? "" : 'white'}` }}
                />
              </IconButton>
              <IconButton
                onClick={stopListening}
                disabled={!listening || isGptTalking}
              >
                {/* mic off btn */}
                <MicOffIcon
                  fontSize="large"
                  style={{ color: `${!listening || isGptTalking ? "" : 'white'}` }}
                />
              </IconButton>
            </>}
          </div>
        </li>
      )}
    </ul>
  )
}
