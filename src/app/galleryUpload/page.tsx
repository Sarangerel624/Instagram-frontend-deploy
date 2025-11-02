"use client";
import { useEffect, useState, ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { upload } from "@vercel/blob/client";
import { useUser } from "@/providers/AuthProvider";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Footer } from "../_components/Footer";
const Page = () => {
  const [caption, setCaption] = useState("");
  const [imgFile, setImgFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState("");
  const { token, user, setToken } = useUser();
  const { push } = useRouter();
  console.log(caption);

  const handleFile = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImgFile(file);
  };

  const uploadedImg = async () => {
    if (!imgFile) return;
    const uploaded = await upload(imgFile.name, imgFile, {
      access: "public",
      handleUploadUrl: "/api/upload",
    });
    setImageUrl(uploaded.url);
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

  return (
    <div className="mt-10 flex flex-col items-center gap-6 p-6 bg-white shadow-lg rounded-xl max-w-md mx-auto">
      <div className="w-full flex flex-col items-center gap-3">
        <label className="font-semibold text-gray-700">Upload an image</label>
        <Input
          type="file"
          accept="image/*"
          onChange={handleFile}
          className="w-full cursor-pointer"
        />
        <Button
          onClick={uploadedImg}
          className="w-full bg-blue-600 text-white hover:bg-blue-700"
        >
          Upload
        </Button>
      </div>

      <div className="w-full">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt="Preview"
            className="w-full h-64 object-cover rounded-lg border border-gray-200"
          />
        ) : (
          <div className="w-full h-64 flex items-center justify-center text-gray-400 border border-dashed border-gray-300 rounded-lg">
            No image uploaded yet
          </div>
        )}
      </div>

      <div className="w-full flex flex-col gap-3">
        <Input
          placeholder="Write a caption..."
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          className="w-full border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 rounded-lg"
        />
        <Button
          onClick={createdUserPost}
          className="w-full bg-green-600 text-white hover:bg-green-700"
        >
          Create Post
        </Button>
      </div>
      <Footer />
    </div>
  );
};

export default Page;
