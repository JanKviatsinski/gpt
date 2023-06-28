import { OpenAIApi } from "openai";
import React, { ChangeEvent, useState } from "react";
// import fs from "fs";

interface Props {
  openai: OpenAIApi;
}

export const ImageVariation = ({ openai }: Props) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    event.target.files && setSelectedFile(event.target.files[0]);
  };

  //   const getImage = (img: File) => {
  //     sharp('input.jpg')
  //   .resize(500, 500)
  //   .grayscale()
  //   .toFile('output.jpg', (err, info) => {
  //     if (err) {
  //       console.error('An error occurred:', err);
  //     } else {
  //       console.log('Image processed successfully.');
  //       console.log('Output:', info);
  //     }
  //   });
  //   }
  const handleFileUpload = () => {
    const mainJs = async (file: File) => {
      console.log(file, "file");

      const completion = await openai.createImageVariation(
        //@ts-ignore
        // fs.createReadStream("./images/eee/png"),
        2,
        "1024x1024"
      );
      console.log(completion.data);
    };

    selectedFile && mainJs(selectedFile);
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleFileUpload}>Upload</button>
    </div>
  );
};
