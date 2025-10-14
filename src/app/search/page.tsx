"use client";
import { useEffect, useState, ChangeEvent } from "react";
import { useUser } from "@/providers/AuthProvider";
import { Input } from "@/components/ui/input";
import { ArrowLeft } from "lucide-react";
type UserDataType = {
  _id: string;
  username: string;
  email: string;
  password: string;
  profilePicture: string | null;
  bio: string | null;
  followers: string[];
  following: string[];
};

type UserPostType = {
  _id: string;
  like: string[];
  images: string[];
  comment: string;
  user: UserDataType;
  caption: string;
  profilePic: string;
};
const Page = () => {
  const [userdata, setUserdata] = useState<UserDataType[]>([]);
  const [input, setInput] = useState("");
  const { token, setToken, user } = useUser();

  const handleInputValue = (e: ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  console.log(input);
  return (
    <div className="flex mt-10 gap-4 px-3 border-b-1 py-4">
      <div className="mt-1">
        <ArrowLeft />
      </div>
      <Input
        placeholder="Search option..."
        className=" w-60"
        value={input}
        onChange={(e) => handleInputValue(e)}
      />
      <div className="mt-0.5">Cancel</div>
    </div>
  );
};

export default Page;
