"use client";
import { useUser } from "@/providers/AuthProvider";
import { useEffect, useState } from "react";
import { Header } from "../_components/Header";
import { Default_Profile } from "@/icons/defualtProjile";
import { Button } from "@/components/ui/button";
import { ZeroPost } from "@/icons/zeroPost";

type PostsType = {
  images: string[];
  caption: string;
  bio: string;
};
const Page = () => {
  const { token, user, setToken } = useUser();
  const [posts, setPosts] = useState<PostsType[]>([]);

  const myPost = async () => {
    const res = await fetch("http://localhost:5000/profilePost", {
      method: "GET",
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    if (res.ok) {
      const response = await res.json();
      setPosts(response);
    }
  };

  useEffect(() => {
    myPost();
  }, [token]);

  return (
    <div>
      <div className="text-center mt-10 font-bold">{user?.username}</div>
      <div className="flex gap-4 px-3">
        <div>
          <Default_Profile />
        </div>
        <div>
          <div className="font-bold text-[20px]">{user?.username}</div>
          <Button variant="secondary" className="font-bold h-6 mt-1.5">
            Edit profile
          </Button>
        </div>
      </div>
      <div className="font-bold border-b-1 bg-gray-500 mt-4">{user?.bio}</div>
      <div className="flex flex-row justify-between px-10 border-b-1 ">
        <div>
          <div>{posts.length}</div>
          <div>posts</div>
        </div>
        <div>
          <div>{user?.followers?.length}</div>
          <div>followers</div>
        </div>
        <div>
          <div>{user?.following?.length}</div>
          <div>following</div>
        </div>
      </div>
      {posts.length === 0 ? (
        <div className="flex flex-col justify-center items-center gap-2.5 mt-20">
          <div>
            <ZeroPost />
          </div>
          <div className="font-bold text-black text-2xl">Share Photos</div>
          <div className="text-center">
            When you share photos, they will appear on your profile
          </div>
          <div className="text-center font-bold text-blue-500">
            Share your first photo
          </div>
        </div>
      ) : (
        <div className="flex flex-wrap flex-row">
          {posts.map((post, index) => (
            <div key={index} className="w-1/3">
              <img src={post?.images?.[0]} className="h-40 " />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Page;
