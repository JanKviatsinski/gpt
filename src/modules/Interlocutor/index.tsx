import React, { useEffect, useState } from "react"
import SpeechRecognition, {
  SpeechRecognitionOptions,
  useSpeechRecognition,
} from "react-speech-recognition"
import { OpenAIApi } from "openai"
import { useTranslation } from "react-i18next"
import { Link } from "react-router-dom"
import { PageNames } from "globalTypes/routing"
import { CorrespondenceInterface } from "./types"
import { Messeger } from "./Messeger"
import { createArrayFromText } from "utils/createArrayFromText"

// interface RealSpeechRecognitionOptions extends SpeechRecognitionOptions {
//   browserSupportsContinuousListening: boolean
// }

interface Props {
  openai: OpenAIApi
}

export const Interlocutor = ({ openai }: Props) => {
  const { t } = useTranslation()
  const synth = window.speechSynthesis

  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
    // @ts-ignore
    browserSupportsContinuousListening
  } = useSpeechRecognition()

  const [gptAnswer, setGptAnswer] = useState("")
  const [isGptTalking, setIsGptSpiking] = useState(false)
  const [isGptThinking, setIsGptThinking] = useState(false)



  const testC = [
    {
      role: "user",
      message: "test1",
      timestump: 111111,
    },
    {
      role: "gpt",
      message: "test12",
      timestump: 111111,
    },
    {
      role: "user",
      message: "test13",
      timestump: 111111,
    },
  ]

  const [correspondence, setCorrespondence] = useState<
    CorrespondenceInterface[]
  >([])


  useEffect(() => {
    const voice = synth.getVoices().find(voice => voice.voiceURI === 'Google UK English Male') || synth.getVoices()[0]
    if (gptAnswer) {
      const array = createArrayFromText(gptAnswer)

      array.forEach((text) => {
        const utterance = new SpeechSynthesisUtterance(text)
        utterance.rate = 0.9
        utterance.voice = voice
        synth.speak(utterance)
        utterance.addEventListener("start", () => {
          setIsGptSpiking(true)
        })
        utterance.addEventListener("end", () => {
          setIsGptSpiking(false)
        })
      })
    }

    return () => {
      synth.cancel()
    }
  }, [gptAnswer])

  useEffect(() => {
    if (!listening && transcript) {
      setCorrespondence((massages) => [
        ...massages,
        { role: "user", message: transcript, timestump: Date.now() },
      ])
      console.log(transcript)

      goConversation(transcript)
    }
  }, [listening])

  const goConversation = async (text: string) => {
    try {
      setIsGptThinking(true)
      const completion = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: "You are my interlocutor." },
          { role: "user", content: text },
        ],
      })
      const answer = completion.data.choices[0].message?.content
      setIsGptThinking(false)

      if (answer) {
        setIsGptSpiking(true)
        setGptAnswer(answer)
        setCorrespondence((massages) => [
          ...massages,
          { role: "gpt", message: answer, timestump: Date.now() },
        ])
      } else {
        throw new Error()
      }
    } catch {
      setIsGptThinking(false)

      console.log("error")
    }
  }

  const stopSpeakingHandler = () => {
    synth.cancel()
    setIsGptSpiking(false)
  }

  const manuallyStartMicrophone = () => {
    SpeechRecognition.startListening({ continuous: true })
    resetTranscript()
  }

  if (!browserSupportsSpeechRecognition) {
    return <span>Browser doesn't support speech recognition.</span>
  }

  return (
    <div className="pb-8 flex flex-col">
      <div className="pb-5 text-blue-500 underline">
        <Link to={"/" + PageNames.corrector}>{`${t("to")} ${t(
          "corrector"
        )} `}</Link>
      </div>
      <p>Microphone: {listening ? "on" : "off"}</p>

      <Messeger
        transcript={transcript}
        messeges={correspondence}
        listening={listening}
        isGptThinking={isGptThinking}
        isGptTalking={isGptTalking}
        startListening={SpeechRecognition.startListening}
        stopSpeaking={stopSpeakingHandler}
        manuallyStartMicrophone={manuallyStartMicrophone}
        browserSupportsContinuousListening={browserSupportsContinuousListening}
        stopListening={SpeechRecognition.stopListening}
      />
    </div>
  )
}
