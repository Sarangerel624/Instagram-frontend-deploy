"use client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useUser } from "@/providers/AuthProvider";
import { Default_Profile } from "@/icons/defualtProjile";
import { Button } from "@/components/ui/button";
import { ZeroPost } from "@/icons/zeroPost";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Footer } from "@/app/_components/Footer";
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
  const { push } = useRouter();
  const mineId = user?._id;
  const userId = params.userId;

  const fetchHeaders = async () => {
    const response = await fetch(
      `https://insta-backend-gbdi.onrender.com/profileHeader/${userId}`,
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
    const response = await fetch(
      `https://insta-backend-gbdi.onrender.com/userPost/${userId}`,
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
      setUserPost(data);
    }
  };

  const followToggle = async (userId: string) => {
    const response = await fetch(
      `https://insta-backend-gbdi.onrender.com/follow-toggle/${userId}`,
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

  const pushToUserPost = (postId: string) => {
    push(`/user-post/${postId}`);
  };
  console.log(userdata, "userdata shu");
  console.log(userId, "ssd");

  return (
    <div className="flex flex-col items-center w-full mt-10">
      {userdata.map((user, index) => (
        <div key={index} className="w-full max-w-3xl">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 sm:gap-16 px-4 sm:px-10">
            <div className="flex justify-center">
              <Avatar className="h-28 w-28 sm:h-36 sm:w-36 rounded-full overflow-hidden border-2 border-gray-200">
                <AvatarImage
                  src={user?.profilePicture?.[0]}
                  alt="@evilrabbit"
                />

                <AvatarFallback>
                  {user?.username.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </div>

            <div className="flex flex-col items-center sm:items-start space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <div className="text-2xl font-semibold">{user.username}</div>
                {user._id !== mineId && (
                  <Button
                    className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-1 rounded-md"
                    onClick={() => followToggle(user._id)}
                  >
                    {user.followers.includes(mineId!) ? "Unfollow" : "Follow"}
                  </Button>
                )}
              </div>

              <div className="flex gap-8 text-sm text-gray-700">
                <div className="text-center">
                  <div className="font-semibold text-base">
                    {userPost.length}
                  </div>
                  <div>Posts</div>
                </div>
                <div className="text-center">
                  <div className="font-semibold text-base">
                    {user.followers.length}
                  </div>
                  <div>Followers</div>
                </div>
                <div className="text-center">
                  <div className="font-semibold text-base">
                    {user.following.length}
                  </div>
                  <div>Following</div>
                </div>
              </div>

              <div className="text-sm text-gray-700 max-w-xs text-center sm:text-left">
                {user.bio || "No bio yet."}
              </div>
            </div>
          </div>

          <div className="border-t border-gray-300 mt-4 mb-2" />

          {userPost.length === 0 ? (
            <div className="flex flex-col justify-center items-center gap-3 mt-10 text-center text-gray-600">
              <ZeroPost />
              <div className="font-bold text-xl text-black">Share Photos</div>
              <p className="max-w-sm">
                When you share photos, they will appear on your profile.
              </p>
              <div className="font-bold text-blue-500 cursor-pointer hover:underline">
                Share your first photo
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-1 sm:gap-2 mt-4">
              {userPost.map((post, index) => (
                <div
                  key={index}
                  className="relative group cursor-pointer"
                  onClick={() => pushToUserPost(post._id)}
                >
                  <img
                    src={post.images?.[0]}
                    alt="post"
                    className="w-full h-36 sm:h-56 object-cover transition-all duration-200 group-hover:opacity-80"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
      <Footer />
    </div>
  );
};

export default Page;
