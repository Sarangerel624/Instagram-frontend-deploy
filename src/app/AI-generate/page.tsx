"use client";
import { ChangeEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Xsign } from "@/icons/Button";
import { access } from "fs";
import { upload } from "@vercel/blob/client";
import { toast } from "sonner";
import { useUser } from "@/providers/AuthProvider";
import { useRouter } from "next/navigation";
import { Footer } from "../_components/Footer";
const Page = () => {
  const [prompt, setPrompt] = useState("");
  const [imageUrl, setImageUrl] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [caption, setCaption] = useState("");
  const HF_API_KEY = process.env.HF_API_KEY;
  const { push } = useRouter();
  const { token, setToken } = useUser();
  const generateImage = async () => {
    if (!prompt.trim()) return;

    setIsLoading(true);

    // try {
    //   const headers = {
    //     "Content-Type": "application/json",
    //     Authorization: `Bearer ${HF_API_KEY}`,
    //   };

    //   const response = await fetch(
    //     `https://router.huggingface.co/hf-inference/models/stabilityai/stable-diffusion-xl-base-1.0`,
    //     {
    //       method: "POST",
    //       headers: headers,
    //       body: JSON.stringify({
    //         inputs: prompt,
    //         parameters: {
    //           negative_prompt: "blurry, bad quality, distorted",
    //           num_inference_steps: 20,
    //           guidance_scale: 7.5,
    //         },
    //       }),
    //     }
    //   );

    //   if (!response.ok) {
    //     throw new Error(`HTTP error! ${response.status}`);
    //   }
    //   const blob = await response.blob();

    //   const file = new File([blob], "generate.png", { type: "image/png" });
    //   const uploaded = await upload(file.name, file, {
    //     access: "public",
    //     handleUploadUrl: "/api/upload",
    //   });

    //   // setImageUrl(uploaded.url);
    //   setImageUrl((prev) => {
    //     return [...prev, uploaded.url];
    //   });
    //   setIsLoading(false);
    // } catch (error) {
    //   setIsLoading(false);
    // }

    const response = await fetch("/api/generate", {
      method: "POST",
      body: JSON.stringify({ prompt }),
    });

    if (!response.ok) throw new Error("Failed to generate");

    const blob = await response.blob();

    const file = new File([blob], "generated.png", { type: "image/png" });

    const uploaded = await upload(file.name, file, {
      access: "public",
      handleUploadUrl: "/api/upload",
    });

    setImageUrl((prev) => {
      return [...prev, uploaded.url];
    });
    setIsLoading(false);
  };

  const createdUserPost = async () => {
    const response = await fetch(
      "https://insta-backend-gbdi.onrender.com/post",
      {
        method: "POST",
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          caption: caption,
          images: imageUrl,
        }),
      }
    );
    console.log(response, "res shu");
    if (response.ok) {
      const post = await response.json();

      toast.success("Post successfully bro :)");
      console.log(post);
    } else {
      toast.error("Post failed bro :(");
    }
  };

  const handleInput = (e: ChangeEvent<HTMLInputElement>) => {
    setCaption(e.target.value);
  };

  console.log(imageUrl);
  console.log(caption, "qw");
  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded-xl shadow-md border border-gray-100">
      <div className="relative mb-6 border-b pb-3">
        <div
          className="absolute left-0 top-0 cursor-pointer hover:bg-gray-100 rounded-full"
          onClick={() => push("/create")}
        >
          <Xsign />
        </div>
        <div className="text-center text-lg font-semibold text-gray-800">
          New AI Photo Post
        </div>
      </div>

      <div className="mb-6">
        <h2 className="font-bold text-2xl mb-2 text-gray-900">
          Explore AI-generated images
        </h2>
        <p className="text-gray-600 mb-4">
          Describe what’s on your mind — be creative and specific for the best
          results.
        </p>

        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <Input
            placeholder="Example: A samurai walking through neon Tokyo streets"
            value={prompt}
            id="prompt"
            onChange={(e) => setPrompt(e.target.value)}
            disabled={isLoading}
            className="flex-1 h-11"
          />
          <Button
            onClick={generateImage}
            disabled={!prompt.trim() || isLoading}
            className="px-6 font-semibold"
          >
            {isLoading ? "Generating..." : "Generate"}
          </Button>
        </div>

        {isLoading && (
          <div className="text-center text-gray-500 mt-3 animate-pulse">
            ⏳ This may take 10–30 seconds...
          </div>
        )}

        {imageUrl && imageUrl.length > 0 && (
          <div className="mt-6">
            <h3 className="font-semibold text-gray-800 mb-3">
              Your generated image:
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {imageUrl.map((url) => (
                <div
                  key={url}
                  className="overflow-hidden rounded-lg shadow-md hover:shadow-lg transition-shadow"
                >
                  <img
                    src={url}
                    alt="AI generated"
                    className="w-full h-full object-cover transition-all duration-300 hover:scale-105"
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="border-t pt-5">
        <h3 className="font-semibold text-gray-800 mb-2">
          Add a caption to your post
        </h3>
        <Input
          placeholder="Write your caption..."
          value={caption}
          onChange={(e) => handleInput(e)}
          className="w-full h-11 mb-4"
        />
        <Button
          onClick={createdUserPost}
          disabled={isLoading}
          className="w-full py-2 font-semibold bg-blue-500 hover:bg-blue-600 text-white rounded-md"
        >
          Create Post
        </Button>
      </div>
      <Footer />
    </div>
  );
};

export default Page;
