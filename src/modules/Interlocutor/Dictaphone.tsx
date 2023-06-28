import React from "react";
import { ListeningOptions } from "react-speech-recognition";

interface Props {
  transcript: string;
  listening: boolean;
  resetTranscript: () => void;
  browserSupportsSpeechRecognition: boolean;
  startListening: (options?: ListeningOptions | undefined) => Promise<void>;
  stopListening: () => Promise<void>;
}

export const Dictaphone = ({
  transcript,
  listening,
  resetTranscript,
  browserSupportsSpeechRecognition,
  startListening,
  stopListening,
}: Props) => {
  if (!browserSupportsSpeechRecognition) {
    return <span>Browser doesn't support speech recognition.</span>;
  }

  return (
    <div>
      <p>Microphone: {listening ? "on" : "off"}</p>
      {/* @ts-ignore */}
      <button className="" onClick={startListening}>
        Start
      </button>
      {/* <button className=" p-4" onClick={stopListening}>
        Stop
      </button>
      <button className=" p-4" onClick={resetTranscript}>
        Reset
      </button> */}
      {/* <p className=" p-4">{transcript}</p> */}
    </div>
  );
};
