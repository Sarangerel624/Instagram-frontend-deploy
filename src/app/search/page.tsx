"use client";
import { useEffect, useState, ChangeEvent } from "react";
import { useUser } from "@/providers/AuthProvider";
import { Input } from "@/components/ui/input";
import { ArrowLeft } from "lucide-react";
import { Default_Profile } from "@/icons/defualtProjile";
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

  const allusers = async () => {
    const response = await fetch(`http://localhost:5000/searchUsers/${input}`, {
        headers:{
           "Content-type": "application/json",
          Authorization: `Bearer ${token}`,
        }
    })
console.log(response)
    if(response.ok) {
      const res = await response.json()
      setUserdata(res)
    }
  }
 
//  const searchedUser = userdata.filter((user) => user.username.toLowerCase().includes(input.toLocaleLowerCase()))

console.log(input)
  useEffect(() => {
    if(token && input) {
       allusers()
    }
  }, [token, input])

  console.log(input, "qwe")


  return (
    <div>
      <div className="flex mt-10 gap-4 px-3 border-b-1 py-4">
        <div className="mt-1">
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
          return(
            <div key={index} className="flex">
                <Default_Profile />
              <div className="ml-2">{user.username}</div>
            </div>
          )
        })}
      </div>
    </div>
  );
};

export default Page;
