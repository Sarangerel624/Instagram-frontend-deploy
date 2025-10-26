"use client";

import { Create_Logo } from "@/icons/creare.photo.logo";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Xsign } from "@/icons/Button";
const Page = () => {
  const { push } = useRouter();

  const handleClick = () => {
    push("/AI-generate");
  };

  const pushToImg = () => {
    push("/galleryUpload");
  };
  return (
    <div className="mt-8">
      <div>
        <div>
          <div className="border-b-2 border-gray" onClick={() => push("/")}>
            <Xsign />
          </div>
          <div className="text-center font-bold mb-5 -mt-8">New photo post</div>
        </div>
      </div>
      <div className="flex flex-col justify-center items-center py-60">
        <Create_Logo />
        <Button className="w-40 bg-blue-500" onClick={pushToImg}>
          Photo library
        </Button>
        <Button className="w-40 text-blue-500 bg-white" onClick={handleClick}>
          Generate with AI
        </Button>
      </div>
    </div>
  );
};

export default Page;
