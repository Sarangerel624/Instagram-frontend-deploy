"use client";
import { useEffect, useState, ChangeEvent } from "react";
import { useParams } from "next/navigation";
import { useUser } from "@/providers/AuthProvider";
import { Default_Profile } from "@/icons/defualtProjile";
import { Heart } from "lucide-react";
import { MessageCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { Ellipsis } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Footer } from "@/app/_components/Footer";

import Autoplay from "embla-carousel-autoplay";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

type UserType = {
  username: string;
  profilePicture: string[];
  followers: string[];
  following: string[];
  _id: string;
};
type UserPostType = {
  caption: string;
  comment: string[];
  comments: string[];
  images: string[];
  like: string[];
  profilePic: string[];
  user: UserType;
  _id: string;
};
const Page = () => {
  const [userPost, setUserPost] = useState<UserPostType>();
  const params = useParams();

  const { token, setToken, user } = useUser();
  const { push } = useRouter();
  const myId = user?._id;
  const postId = params.postId;
  const autoplay = React.useRef(
    Autoplay({ delay: 3000, stopOnInteraction: false })
  );
  const fetchPosts = async () => {
    const response = await fetch(
      `https://insta-backend-gbdi.onrender.com/userPostyee/${postId}`,
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
  const postlikes = async () => {
    const response = await fetch(
      `https://insta-backend-gbdi.onrender.com/toggle-like/${postId}`,
      {
        method: "POST",
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (response.ok) {
      fetchPosts();
    }
  };

  const pushComment = (userId: string) => {
    push(`/comment/${userId}`);
  };

  const deletePost = async () => {
    const response = await fetch(
      `https://insta-backend-gbdi.onrender.com/userPostDelete/${postId}`,
      {
        method: "DELETE",
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (response.ok) {
      push(`/idPost`);
    }
  };

  useEffect(() => {
    if (token) {
      fetchPosts();
    }
  }, [token]);

  console.log(userPost);
  return (
    <div className="mt-10 max-w-md mx-auto bg-white rounded-md shadow-sm border border-gray-200">
      <div className="flex justify-between items-center p-4">
        <div className="flex items-center gap-3">
          <Avatar
            className="h-11 w-11 cursor-pointer ring-1 ring-gray-200"
            onClick={() => push("/ToUserProfile")}
          >
            <AvatarImage
              src={userPost?.user?.profilePicture?.[0]}
              alt={userPost?.user?.username}
            />
            <AvatarFallback>
              {userPost?.user?.username?.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>

          <div
            className="font-semibold text-gray-800 cursor-pointer hover:underline"
            onClick={() => push(`/profile/${userPost?.user._id}`)}
          >
            {userPost?.user?.username}
          </div>
        </div>

        <Dialog>
          <DialogTrigger asChild>
            <Ellipsis className="text-gray-600" />
          </DialogTrigger>
          <DialogContent className="w-60 rounded-xl">
            <DialogTitle className="text-center font-semibold text-gray-800">
              Options
            </DialogTitle>
            <DialogDescription
              className="text-red-600 font-semibold text-center py-2 cursor-pointer hover:bg-gray-100 rounded-md"
              onClick={deletePost}
            >
              Delete
            </DialogDescription>
            <DialogDescription className="font-semibold text-center py-2 cursor-pointer hover:bg-gray-100 rounded-md">
              Edit
            </DialogDescription>
            <DialogDescription className="text-gray-600 font-semibold text-center py-2 cursor-pointer hover:bg-gray-100 rounded-md">
              Cancel
            </DialogDescription>
          </DialogContent>
        </Dialog>
      </div>

      <div className="relative">
        <Carousel
          plugins={[autoplay.current]}
          className="relative w-full"
          onMouseEnter={autoplay.current.stop}
          onMouseLeave={autoplay.current.reset}
        >
          <CarouselContent>
            {userPost?.images.map((postImg, index) => (
              <CarouselItem key={index}>
                <div className="aspect-square bg-black">
                  <img
                    src={postImg}
                    alt="post"
                    className="object-cover w-full h-full transition-all duration-300 hover:opacity-90"
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>

      <div className="flex items-center gap-3 p-4">
        <div
          onClick={postlikes}
          className="cursor-pointer hover:scale-110 transition-transform"
        >
          {userPost?.like.includes(myId!) ? (
            <Heart color="red" fill="red" />
          ) : (
            <Heart />
          )}
        </div>

        <div className="text-sm">{userPost?.like.length}</div>

        <div
          onClick={() => pushComment(userPost?._id!)}
          className="cursor-pointer hover:scale-110 transition-transform"
        >
          <MessageCircle />
        </div>
      </div>

      <div className="px-4 pb-2 text-sm">
        <div className="flex gap-2">
          <span className="font-semibold">{userPost?.user?.username}</span>
          <span>{userPost?.caption}</span>
        </div>
      </div>

      <div className="px-4 pb-4 text-sm text-gray-500">
        <div className="cursor-pointer hover:text-gray-700">
          View all {userPost?.comments.length} comments
        </div>
        <div
          className="cursor-pointer hover:text-gray-700"
          onClick={() => pushComment(userPost?._id!)}
        >
          Add a comment...
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Page;
