import React, { useEffect, useState } from "react";

interface Props {
  text: string;
}

export const TextToSpeech: React.FC<Props> = ({ text }) => {
  const [isPaused, setIsPaused] = useState(false);
  const [utterance, setUtterance] = useState<SpeechSynthesisUtterance | null>(
    null
  );

  function createArrayFromText(text: string): string[] {
    return text.trim().split(/(?<=[.!?])\s+/);
  }

  useEffect(() => {
    const synth = window.speechSynthesis;
    const u = new SpeechSynthesisUtterance(text);
    u.rate = 0.8;
    u.voice = synth.getVoices()[146] || null;

    if (u) {
      setUtterance(u);
    }

    if (u && text) {
      const array = createArrayFromText(text);
      array.forEach((text) => {
        const u = new SpeechSynthesisUtterance(text);
        console.log(synth.getVoices());
        u.rate = 0.8;
        u.voice = synth.getVoices()[146] || null;
        synth.speak(u);
      });

      // synth.speak(u);
      console.log(synth);
    }

    return () => {
      synth.cancel();
    };
  }, [text]);

  const handlePlay = () => {
    const synth = window.speechSynthesis;

    if (isPaused) {
      synth.resume();
    }

    if (utterance && text) {
      synth.speak(utterance);
    }

    setIsPaused(false);
  };

  const handlePause = () => {
    const synth = window.speechSynthesis;

    synth.pause();

    setIsPaused(true);
  };

  const handleStop = () => {
    const synth = window.speechSynthesis;

    synth.cancel();

    setIsPaused(false);
  };

  return (
    <div>
      <button className=" p-3" onClick={handlePlay}>
        {isPaused ? "Resume" : "Play"}
      </button>
      <button className=" p-3" onClick={handlePause}>
        Pause
      </button>
      <button className=" p-3" onClick={handleStop}>
        Stop
      </button>
    </div>
  );
};
