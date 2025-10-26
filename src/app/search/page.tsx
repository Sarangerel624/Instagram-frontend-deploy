"use client";
import { useEffect, useState, ChangeEvent } from "react";
import { useUser } from "@/providers/AuthProvider";
import { Input } from "@/components/ui/input";
import { ArrowLeft } from "lucide-react";
import { Default_Profile } from "@/icons/defualtProjile";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
  const { push } = useRouter();
  const handleInputValue = (e: ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const allusers = async () => {
    const response = await fetch(`http://localhost:5000/searchUsers/${input}`, {
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    console.log(response);
    if (response.ok) {
      const res = await response.json();
      setUserdata(res);
    }
  };

  //  const searchedUser = userdata.filter((user) => user.username.toLowerCase().includes(input.toLocaleLowerCase()))

  const pushToUserProfile = (userId: string) => {
    push(`/profile/${userId}`);
  };
  console.log(input);
  useEffect(() => {
    if (token && input) {
      allusers();
    }
  }, [token, input]);

  console.log(userdata, "qwe");

  return (
    <div>
      <div className="flex mt-10 gap-4 px-3 border-b-1 py-4">
        <div className="mt-1" onClick={() => push("/")}>
          <ArrowLeft />
        </div>
        <Input
          placeholder="Search option..."
          className=" w-60"
          value={input}
          onChange={handleInputValue}
        />
        <div className="mt-0.5">Cancel</div>
      </div>
      <div>
        {userdata.map((user, index) => {
          return (
            <div key={index} className="flex mt-2 ml-2">
              <Avatar
                className="rounded-ls h-11 w-11"
                onClick={() => push("/ToUserProfile")}
              >
                <AvatarImage
                  src={user?.profilePicture?.[0]}
                  alt="@evilrabbit"
                />
                <AvatarFallback>
                  {" "}
                  {user?.username?.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div
                className="ml-2 font-bold mt-2"
                onClick={() => pushToUserProfile(user._id)}
              >
                {user.username}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Page;
