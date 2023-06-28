import Button from "@mui/material/Button";
import { OpenAIApi } from "openai";
import React from "react";
interface Props {
  openai: OpenAIApi;
}

export const CreateImage = ({ openai }: Props) => {
  const mainJs = async () => {
    const response = await openai.createImage({
      prompt: "A cute baby sea otter",
      n: 1,
      size: "1024x1024",
    });
    console.log(response);
  };

  return (
    <Button variant="contained" onClick={mainJs}>
      get image
    </Button>
  );
};
