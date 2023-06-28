import { createBrowserRouter } from "react-router-dom";
import { Interlocutor } from "modules/Interlocutor";
import { Corrector } from "modules/Corrector";
import { openai } from "gptInstance";
import { PageNames } from "globalTypes/routing";
export const router = createBrowserRouter([
  {
    path: "/",
    element: <Corrector openai={openai} />,
  },
  {
    path: PageNames.corrector,
    element: <Corrector openai={openai} />,
  },
  {
    path: PageNames.interlocutor,
    element: <Interlocutor openai={openai} />,
  },
]);
