import React, { useEffect, useState } from "react"
import { Dictaphone } from "./Dictaphone"
import { TextToSpeech } from "./TextToSpeech"
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition"
import { OpenAIApi } from "openai"
import { useTranslation } from "react-i18next"
import { Link } from "react-router-dom"
import { PageNames } from "globalTypes/routing"
import { CorrespondenceInterface } from "./types"
import { Messeger } from "./Messeger"
import { createArrayFromText } from "utils/createArrayFromText"

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
  } = useSpeechRecognition()

  const [gptAnswer, setGptAnswer] = useState("")
  const [utterances, setUtterances] = useState<SpeechSynthesisUtterance[]>([])
  const [isGptSpiking, setIsGptSpiking] = useState(false)
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

    console.log(synth.getVoices())
    if (gptAnswer) {
      const array = createArrayFromText(gptAnswer)

      array.forEach((text) => {
        const utterance = new SpeechSynthesisUtterance(text)
        utterance.rate = 0.9
        utterance.voice = voice
        synth.speak(utterance)
        utterance.addEventListener("start", () => {
          console.log("start")
          setIsGptSpiking(true)
        })
        utterance.addEventListener("end", () => {
          console.log("end")
          setIsGptSpiking(false)
        })
        setUtterances((utrs) => [...utrs, utterance])
      })
    }

    return () => {
      synth.cancel()
    }
  }, [gptAnswer])

  const goConversation = async (text: string) => {
    try {
      setIsGptThinking(true)
      const completion = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        max_tokens: 256,
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

  useEffect(() => {
    // console.log(!listening, transcript, !firstRender);

    if (!listening && transcript) {
      console.log(transcript)
      setCorrespondence((massages) => [
        ...massages,
        { role: "user", message: transcript, timestump: Date.now() },
      ])
      goConversation(transcript)
    }
  }, [listening])

  const stopSpeakingHandler = () => {
    // utterances.forEach(uttr => )
    synth.cancel()
    setIsGptSpiking(false)
  }

  return (
    <div className="pb-8 flex flex-col">
      <div className="pb-5 text-blue-500 underline">
        <Link to={"/" + PageNames.corrector}>{`${t("to")} ${t(
          "corrector"
        )} `}</Link>
      </div>
      <Dictaphone
        transcript={transcript}
        listening={listening}
        resetTranscript={resetTranscript}
        browserSupportsSpeechRecognition={browserSupportsSpeechRecognition}
        startListening={SpeechRecognition.startListening}
        stopListening={SpeechRecognition.stopListening}
      />
      {/* <TextToSpeech text={gptAnswer} /> */}

      <Messeger
        transcript={transcript}
        messeges={correspondence}
        listening={listening}
        isGptThinking={isGptThinking}
        isGptSpiking={isGptSpiking}
        startListening={SpeechRecognition.startListening}
        stopSpeaking={stopSpeakingHandler}
      />
    </div>
  )
}
