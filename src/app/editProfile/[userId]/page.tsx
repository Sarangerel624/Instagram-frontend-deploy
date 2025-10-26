"use client";
import { useEffect, useState, ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Default_Profile } from "@/icons/defualtProjile";
import { useUser } from "@/providers/AuthProvider";
import { upload } from "@vercel/blob/client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

type upDatetype = {
  username: string;
  bio: string;
};

type UserDatatype = {
  username: string;
  email: string;
  profilePicture: string;
  bio: string;
};
const Page = () => {
  const [update, setUpdate] = useState();
  const [editUserDatas, setEditUserDatas] = useState<UserDatatype>();
  const { token, user, setToken } = useUser();
  const [imgFile, setImgFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState("");
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

  const uploadedImg = async () => {
    if (!imgFile) return;
    const uploaded = await upload(imgFile.name, imgFile, {
      access: "public",
      handleUploadUrl: "/api/upload",
    });
    setImageUrl(uploaded.url);
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

  const handleFile = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImgFile(file);
  };
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
      toast.success("amjilttai username, bio soligdloo");
    }
  };

  const editProfilePic = async () => {
    const response = await fetch(`http://localhost:5000/editProfilePicture`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        profilePicture: imageUrl,
        _id: user?._id,
      }),
    });
    if (response.ok) {
      const res = await response.json();
      setUpdate(res);
      toast.success("profile successfully soligdloo :))");
    }
  };

  useEffect(() => {
    if (token) {
      editUserdata();
    }
  }, [token]);

  console.log(editUserDatas, "img url");

  return (
    <div>
      <div>
        <div className="text-center mt-8 font-bold">Edit profile</div>
        <div className="border-t-2 mt-2 ml-3 ">Edit profile</div>
        <div className="ml-3">
          <div className="flex p-1.5 gap-2 ml-3">
            <Avatar className="rounded-ls h-11 w-11">
              <AvatarImage
                src={editUserDatas?.profilePicture}
                alt="@evilrabbit"
              />
              <AvatarFallback>{editUserDatas?.username}</AvatarFallback>
            </Avatar>
            <Dialog>
              <DialogTrigger>
                <div className="text-blue-400 font-bold">Change photo</div>
              </DialogTrigger>
              <DialogTitle></DialogTitle>
              <DialogContent>
                <div className="ml-3">Profile Picture</div>
                <Input
                  type="file"
                  accept="image/*"
                  className="w-[300px] ml-3"
                  placeholder="zurga oruulna uu"
                  onChange={handleFile}
                />
                <DialogFooter>
                  <Button onClick={uploadedImg} className="w-30 ml-3">
                    upload img
                  </Button>
                  <Button onClick={editProfilePic} className="w-60 ml-3">
                    Change profile picture
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
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
