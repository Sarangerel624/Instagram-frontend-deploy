"use client";
import { useUser } from "@/providers/AuthProvider";
import { useEffect, useState } from "react";
import { Header } from "../_components/Header";
import { Default_Profile } from "@/icons/defualtProjile";
import { Button } from "@/components/ui/button";
import { ZeroPost } from "@/icons/zeroPost";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Footer } from "../_components/Footer";
type PostsType = {
  images: string[];
  caption: string;
  bio: string;
  _id: string;
};

type UserDataType = {
  bio: string;
  username: string;
  email: string;
  images: string[];
  followers: string[];
  following: string[];
  profilePicture: string[];
};
const Page = () => {
  const { token, user, setToken } = useUser();
  const [posts, setPosts] = useState<PostsType[]>([]);
  const [userData, setUserdata] = useState<UserDataType>();
  const { push } = useRouter();
  const router = useRouter();
  const myPost = async () => {
    const res = await fetch(
      "https://insta-backend-gbdi.onrender.com/profilePost",
      {
        method: "GET",
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (res.ok) {
      const response = await res.json();
      setPosts(response);
    }
  };

  const userId = user?._id;
  const userDataFetch = async () => {
    const response = await fetch(
      `https://insta-backend-gbdi.onrender.com/editUserdata/${userId}`,
      {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (response.ok) {
      const res = await response.json();
      setUserdata(res);
    }
  };
  const pushToUserPost = (postId: string) => {
    push(`/user-post/${postId}`);
  };

  const pushToEditPro = () => {
    push(`/editProfile/${user?._id}`);
  };

  const logOut = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  const pushToUserProfile = (userId: string) => {
    push(`/profile/${userId}`);
  };

  useEffect(() => {
    if (token) {
      myPost();
      userDataFetch();
    }
  }, [token]);

  return (
    <div className="max-w-3xl mx-auto mt-10 px-4 text-gray-800">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-start gap-8 border-b border-gray-200 pb-6">
        <div className="flex justify-center sm:justify-start">
          <Avatar
            className="h-24 w-24 sm:h-32 sm:w-32 cursor-pointer ring-1 ring-gray-300"
            onClick={() => push("/ToUserProfile")}
          >
            <AvatarImage
              src={userData?.profilePicture?.[0]}
              alt={userData?.username}
            />
            <AvatarFallback className="text-xl font-semibold bg-gray-100">
              {userData?.username?.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </div>

        <div className="flex flex-col sm:ml-10 space-y-2 text-center sm:text-left">
          <div className="text-2xl font-semibold">{userData?.username}</div>
          <div className="flex justify-center sm:justify-start gap-3">
            <Button
              variant="secondary"
              className="font-semibold px-4 py-1.5 rounded-md bg-gray-100 hover:bg-gray-200"
              onClick={pushToEditPro}
            >
              Edit profile
            </Button>
            <Button
              variant="secondary"
              className="font-semibold px-4 py-1.5 rounded-md bg-gray-100 hover:bg-gray-200"
              onClick={() => logOut()}
            >
              Log out
            </Button>
          </div>
          <div className="mt-4 text-center sm:text-left">
            <div className="font-medium">{userData?.bio || "No bio yet."}</div>
          </div>
        </div>
      </div>

      <div className="flex justify-around sm:justify-center sm:gap-16 pt-3 pb-2 text-sm">
        <div className="text-center">
          <div className="font-bold text-base">{posts.length}</div>
          <div className="text-gray-500">Posts</div>
        </div>
        <div className="text-center">
          <div className="font-bold text-base">
            {userData?.followers?.length}
          </div>
          <div className="text-gray-500">Followers</div>
        </div>
        <div className="text-center">
          <div className="font-bold text-base">
            {userData?.following?.length}
          </div>
          <div className="text-gray-500">Following</div>
        </div>
      </div>

      <div className="border-t border-gray-200 my-4" />

      {posts.length === 0 ? (
        <div className="flex flex-col justify-center items-center gap-3 mt-20 text-gray-600">
          <ZeroPost />
          <div className="font-bold text-xl text-black">Share Photos</div>
          <p className="max-w-sm text-center">
            When you share photos, they will appear on your profile.
          </p>
          <div className="font-bold text-blue-500 cursor-pointer hover:underline">
            Share your first photo
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-1 sm:gap-2">
          {posts.map((post, index) => (
            <div
              key={index}
              className="relative cursor-pointer group"
              onClick={() => pushToUserPost(post._id)}
            >
              <img
                src={post?.images?.[0]}
                className="aspect-square object-cover transition-all duration-200 group-hover:opacity-80"
                alt="post"
              />
            </div>
          ))}
        </div>
      )}
      <Footer />
    </div>
  );
};

export default Page;
