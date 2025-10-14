"use client";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Smile } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useUser } from "@/providers/AuthProvider";
import { Default_Profile } from "@/icons/defualtProjile";
import { useState, ChangeEvent } from "react";

const Page = () => {
  const { token, user, setToken } = useUser();
  const [commentValue, setCommentValue] = useState("");
  const params = useParams();

  const handleInputValue = (e: ChangeEvent<HTMLInputElement>) => {
    setCommentValue(e.target.value);
  };

  console.log(commentValue);
  return (
    <div>
      <div className="text-center font-bold mt-9 border-b-1 p-2">Comments</div>
      <Default_Profile />
      <div>{user?.username}</div>
      <Input
        placeholder="add a comment..."
        value={commentValue}
        onChange={(e) => handleInputValue(e)}
      />
    </div>
  );
};

export default Page;
