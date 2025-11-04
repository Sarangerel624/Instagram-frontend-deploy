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
import { Footer } from "@/app/_components/Footer";

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
      `https://insta-backend-gbdi.onrender.com/editUserdata/${userId}`,
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
    const response = await fetch(
      `https://insta-backend-gbdi.onrender.com/editUserProfile`,
      {
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
      }
    );
    if (response.ok) {
      const res = await response.json();
      setUpdate(res);
      toast.success("amjilttai username, bio soligdloo");
    }
  };

  const editProfilePic = async () => {
    const response = await fetch(
      `https://insta-backend-gbdi.onrender.com/editProfilePicture`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          profilePicture: imageUrl,
          _id: user?._id,
        }),
      }
    );
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
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-10">
      <div className="bg-white shadow-md rounded-lg w-full max-w-md p-6">
        <h2 className="text-2xl font-semibold text-center text-gray-800">
          Edit Profile
        </h2>
        <div className="border-b-2 border-gray-200 mt-4 mb-6"></div>

        <div className="flex items-center gap-4 mb-6">
          <Avatar className="h-16 w-16 rounded-full ring-2 ring-blue-400">
            <AvatarImage
              src={editUserDatas?.profilePicture}
              alt={editUserDatas?.username}
            />
            <AvatarFallback>
              {editUserDatas?.username?.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>

          <Dialog>
            <DialogTrigger>
              <div className="text-blue-600 font-medium hover:underline">
                Change photo
              </div>
            </DialogTrigger>
            <DialogContent className="bg-white rounded-lg p-5 shadow-lg">
              <DialogTitle className="font-semibold text-gray-700 mb-3">
                Change Profile Picture
              </DialogTitle>
              <Input
                type="file"
                accept="image/*"
                className="w-full"
                onChange={handleFile}
              />
              <DialogFooter className="flex justify-end gap-2 mt-4">
                <Button onClick={uploadedImg} variant="outline">
                  Upload
                </Button>
                <Button
                  onClick={editProfilePic}
                  className="bg-blue-600 text-white"
                >
                  Save
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="mb-4">
          <label className="text-gray-700 font-medium mb-1 block">
            Username
          </label>
          <Input
            placeholder={editUserDatas?.username}
            className="w-full"
            name="username"
            value={inputValues.username}
            onChange={(e) => hangleInputs(e)}
          />
        </div>

        <div className="mb-6">
          <label className="text-gray-700 font-medium mb-1 block">Bio</label>
          <Input
            placeholder={editUserDatas?.bio || "Tell us about yourself..."}
            className="w-full"
            name="bio"
            value={inputValues.bio}
            onChange={(e) => hangleInputs(e)}
          />
        </div>

        <Button
          onClick={editProfileUser}
          className="w-full bg-blue-600 text-white font-semibold py-2 rounded-md hover:bg-blue-700 transition"
        >
          Save Changes
        </Button>
      </div>

      <div className="mt-10 w-full">
        <Footer />
      </div>
    </div>
  );
};

export default Page;
