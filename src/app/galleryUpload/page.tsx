"use client";
import { useEffect, useState, ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { upload } from "@vercel/blob/client";
import { useUser } from "@/providers/AuthProvider";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
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
    const response = await fetch("http://localhost:5000/post", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        caption: caption,
        images: imageUrl,
      }),
    });
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
    <div className="mt-10">
      <Input type="file" accept="image/*" onChange={handleFile} />
      <Button onClick={uploadedImg}>upload</Button>
      {imageUrl ? <img src={imageUrl}></img> : <div>No image uploaded yet</div>}
      <Input
        placeholder="write a caption..."
        value={caption}
        onChange={(e) => setCaption(e.target.value)}
      />
      <Button onClick={createdUserPost}>create a post</Button>
    </div>
  );
};

export default Page;
