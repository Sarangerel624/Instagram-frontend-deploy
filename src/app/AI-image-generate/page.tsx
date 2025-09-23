"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Xsign } from "@/icons/Button";
import { access } from "fs";
const Page = () => {
  const [prompt, setPrompt] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const HF_API_KEY = process.env.HF_API_KEY;

  const generateImage = async () => {
    if (!prompt.trim()) return;

    setIsLoading(true);
    setImageUrl("");

    try {
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${HF_API_KEY}`,
      };

      const response = await fetch(
        `https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0`,
        {
          method: "POST",
          headers: headers,
          body: JSON.stringify({
            inputs: prompt,
            parameters: {
              negative_prompt: "blurry, bad quality, distorted",
              num_inference_steps: 20,
              guidance_scale: 7.5,
            },
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`HPPT error! ${response.status}`);
      }
      const blob = await response.blob();
      const imageUrl = URL.createObjectURL(blob);

      setImageUrl(imageUrl);
    } catch (err) {
      setIsLoading(false);
    }
  };

  console.log(imageUrl);
  return (
    <div>
      <div>
        <div className="border-b-2 border-gray">
          <Xsign />
        </div>
        <div className="text-center font-bold -mt-8 ">New photo post</div>
      </div>
      <div>
        <div className="font-bold text-2xl p-4">Explore AI generate images</div>
        <div className="pl-4 text-gray-700">
          Describe what's on your mind. For best results, be specific
        </div>
        <Input
          placeholder="Example: I'm walking in fog like Bladerunner 2049"
          value={prompt}
          id="prompt"
          onChange={(e) => setPrompt(e.target.value)}
          disabled={isLoading}
          className="w-92 h-30 m-2.5"
        ></Input>
        <Button onClick={generateImage} disabled={!prompt.trim() || isLoading}>
          generate
        </Button>
        {isLoading && <div>this may take 10-30 seconds</div>}
        {imageUrl && (
          <div>
            <h2>Your generared image:</h2>
            <div>
              <img
                src={imageUrl}
                className="w-full h-auto rounded-b-lg shadow-md"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Page;
