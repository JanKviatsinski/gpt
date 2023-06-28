import { Button } from "@mui/base";
import CircularProgress from "@mui/material/CircularProgress";
import React, { useEffect, useRef } from "react";
import { CorrespondenceInterface } from "../types";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";
import { ListeningOptions } from "react-speech-recognition";
import { IconButton } from "@mui/material";
import VoiceOverOffIcon from "@mui/icons-material/VoiceOverOff";

interface Props {
  messeges: CorrespondenceInterface[];
  isGptThinking: boolean;
  transcript: string;
  listening: boolean;
  startListening: (options?: ListeningOptions | undefined) => Promise<void>;
  stopSpeaking: () => void;
  isGptSpiking: boolean;
}

export const Messeger = ({
  messeges,
  isGptThinking,
  startListening,
  listening,
  transcript,
  isGptSpiking,
  stopSpeaking,
}: Props) => {
  const ulRef = useRef<HTMLUListElement | null>(null);

  useEffect(() => {
    if (ulRef.current) {
      const element = ulRef.current;
      element.scrollTop = element.scrollHeight;
    }
  }, [messeges]);
  const liClassName =
    "flex flex-col mb-2 rounded p-3 w-[48%] max-w-[450px] items-end";
  const userLiClassName = "text-right bg-blue-800 text-white self-end";
  const gptLiClassName = "bg-blue-200 self-start";
  return (
    <ul
      ref={ulRef}
      className=" flex flex-col border-blue-500 p-2 border rounded max-h-[90vh] overflow-y-auto"
    >
      {messeges.map((msg, i) => (
        <li
          className={`${liClassName} ${
            msg.role === "user" ? userLiClassName : gptLiClassName
          }`}
        >
          {msg.message}
          <div className="min-h-[40px]">
            {msg.role === "gpt" &&
              i === messeges.length - 1 &&
              isGptSpiking && (
                <IconButton onClick={stopSpeaking}>
                  <VoiceOverOffIcon
                  // fontSize="large"
                  //   color={`${listening ? "disabled" : "info"}`}
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
          {transcript}
          <IconButton
            onClick={() => startListening()}
            disabled={listening || isGptSpiking}
          >
            <PlayCircleIcon
              fontSize="large"
              color={`${listening || isGptSpiking ? "disabled" : "info"}`}
            />
          </IconButton>
        </li>
      )}
    </ul>
  );
};
