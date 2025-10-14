"use client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useUser } from "@/providers/AuthProvider";
import { Default_Profile } from "@/icons/defualtProjile";
import { Button } from "@/components/ui/button";
import { ZeroPost } from "@/icons/zeroPost";

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
  const params = useParams();
  const [userdata, setUserdata] = useState<UserDataType[]>([]);
  const [userPost, setUserPost] = useState<UserPostType[]>([]);
  const { token, setToken, user } = useUser();

  const mineId = user?._id;
  const userId = params.userId;

  const fetchHeaders = async () => {
    const response = await fetch(
      `http://localhost:5000/profileHeader/${userId}`,
      {
        method: "GET",
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (response.ok) {
      const data = await response.json();
      setUserdata(data);
    }
  };

  const fetchPosts = async () => {
    const response = await fetch(`http://localhost:5000/userPost/${userId}`, {
      method: "GET",
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    if (response.ok) {
      const data = await response.json();
      setUserPost(data);
    }
  };

  const followToggle = async (userId: string) => {
    const response = await fetch(
      `http://localhost:5000/follow-toggle/${userId}`,
      {
        method: "POST",
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.ok) {
      fetchHeaders();
    }
  };

  useEffect(() => {
    if (token) {
      fetchHeaders();
      fetchPosts();
    }
  }, [token]);
  console.log(userdata, "userdata shu");
  console.log(userId, "ssd");

  return (
    <div>
      <div>
        {userdata.map((user, index) => {
          return (
            <div key={index}>
              <div className="mt-10 text-center font-bold">{user.username}</div>
              <div className="flex">
                <div className="p-3">
                  <Default_Profile />
                </div>
                <div className="flex flex-col">
                  <div className="mt-2 font-bold ml-2">{user.username}</div>
                  <div>
                    {user.followers.includes(mineId!) ? (
                      <Button
                        className="bg-blue-400"
                        onClick={() => followToggle(user._id)}
                      >
                        Unfollow
                      </Button>
                    ) : (
                      <Button
                        className="bg-blue-400"
                        onClick={() => followToggle(user._id)}
                      >
                        Follow
                      </Button>
                    )}
                  </div>
                </div>
              </div>
              <div className="font-bold">{user.username}</div>
              <div className="border-b-2">{user.bio}</div>
              <div className="flex flex-row justify-between px-10 border-b-1 ">
                <div>
                  <div>{userPost.length}</div>
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
            </div>
          );
        })}
      </div>
      <div>
        {userPost.length === 0 ? (
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
            {userPost.map((post, index) => (
              <div key={index} className="w-1/3">
                <img src={post?.images?.[0]} className="h-40 " />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Page;
