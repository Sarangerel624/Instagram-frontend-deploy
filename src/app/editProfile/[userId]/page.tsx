"use client";
import { useEffect, useState, ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Default_Profile } from "@/icons/defualtProjile";
import { useUser } from "@/providers/AuthProvider";

type upDatetype = {
  username: string;
  bio: string;
};

type UserDatatype = {
  username: string;
  email: string;
  profilePicture: string[];
  bio: string;
};
const Page = () => {
  const [update, setUpdate] = useState();
  const [editUserDatas, setEditUserDatas] = useState<UserDatatype>();
  const { token, user, setToken } = useUser();
  const [inputValues, setInputValues] = useState<upDatetype>({
    username: "",
    bio: "",
  });
  const hangleInputs = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInputValues({
      ...inputValues,
      [name]: value,
    });
  };
  const userId = user?._id;
  const editUserdata = async () => {
    const response = await fetch(
      `http://localhost:5000/editUserdata/${userId}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (response.ok) {
      const res = await response.json();
      setEditUserDatas(res);
    }
  };

  console.log(inputValues);
  const editProfileUser = async () => {
    const response = await fetch(`http://localhost:5000/editUserProfile`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        username: inputValues.username,
        bio: inputValues.bio,
        _id: user?._id,
      }),
    });
    if (response.ok) {
      const res = await response.json();
      setUpdate(res);
    }
  };

  useEffect(() => {
    if (token) {
      editUserdata();
    }
  }, [token]);

  return (
    <div>
      <div>
        <div className="text-center mt-8 font-bold">Edit profile</div>
        <div className="border-t-2 mt-2 ml-3 ">Edit profile</div>
        <div className="w-[400px] h-[60px] bg-gray-300 rounded-2xl">
          <div className="flex p-1.5 gap-2 ml-3">
            <Default_Profile />
            <div>
              <div className="font-bold">{editUserDatas?.username}</div>
              <div className="text-blue-400 font-bold">Change photo</div>
            </div>
          </div>
        </div>
        <div className="ml-3">Username</div>
        <Input
          placeholder={editUserDatas?.username}
          className="w-[400px] ml-3"
          name="username"
          value={inputValues.username}
          onChange={(e) => hangleInputs(e)}
        />
        <div className="ml-3">Bio</div>
        <Input
          className="w-[400px] ml-3"
          placeholder={editUserDatas?.bio}
          name="bio"
          value={inputValues.bio}
          onChange={(e) => hangleInputs(e)}
        />
      </div>
      <div>
        <Button onClick={editProfileUser}>Submit</Button>
      </div>
    </div>
  );
};

export default Page;
