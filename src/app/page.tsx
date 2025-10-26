"use client";
import * as React from "react";
import { Default_Profile } from "@/icons/defualtProjile";
import { Like_comment_logo } from "@/icons/Frame 16";
import { Ig_Logo } from "@/icons/image 5";
import { useEffect, useState } from "react";
import { useUser } from "@/providers/AuthProvider";
import { useRouter } from "next/navigation";
import { Heart } from "lucide-react";
import { MessageCircle } from "lucide-react";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import useEmblaCarousel, {
  type UseEmblaCarouselType,
} from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
type Post = {
  profilePicture: string;
  images: string[];
  caption: string;
  like: string[];
  comment: string[];
  _id: string;
  user: {
    _id: string;
    username: string;
    email: string;
    password: string;
    profilePicture: string | null;
    bio: string | null;
    followers: string[];
    following: string[];
  };
};

const Page = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const { token, user, setToken } = useUser();
  const { push } = useRouter();
  const myId = user?._id;
  const allposts = async () => {
    const response = await fetch("http://localhost:5000/allpost", {
      method: "GET",
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    const result = await response.json();
    setPosts(result);
  };

  const postlikes = async (postId: string) => {
    const response = await fetch(
      `http://localhost:5000/toggle-like/${postId}`,
      {
        method: "POST",
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (response.ok) {
      allposts();
    }
  };
  const userId = user?._id;
  const pushToUserProfile = (userId: string) => {
    push(`/profile/${userId}`);
  };

  const pushComment = (userId: string) => {
    push(`/comment/${userId}`);
  };
  useEffect(() => {
    if (token) {
      allposts();
    }
  }, [token]);

  const autoplay = React.useRef(
    Autoplay({ delay: 3000, stopOnInteraction: false })
  );

  console.log(posts, "as");

  return (
    <div className="flex flex-col items-center mt-8 space-y-10">
      {posts.map((post, index) => (
        <div
          key={index}
          className="bg-white border border-gray-200 rounded-lg shadow-sm w-full max-w-md"
        >
          {/* User Info */}
          <div className="flex items-center gap-3 p-4">
            <Avatar
              className="cursor-pointer h-11 w-11 ring-1 ring-gray-200"
              onClick={() => pushToUserProfile(post.user._id)}
            >
              <AvatarImage
                src={post?.user?.profilePicture?.[0]}
                alt={post?.user?.username}
              />
              <AvatarFallback>
                {post?.user?.username?.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>

            <div
              className="font-semibold text-gray-800 cursor-pointer hover:underline"
              onClick={() => pushToUserProfile(post.user._id)}
            >
              {post?.user?.username}
            </div>
          </div>

          {/* Image Carousel */}
          <Carousel
            plugins={[autoplay.current]}
            className="relative w-full"
            onMouseEnter={autoplay.current.stop}
            onMouseLeave={autoplay.current.reset}
          >
            <CarouselContent>
              {post.images.map((postImg, index) => (
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

          {/* Post Actions */}
          <div className="p-4 space-y-2">
            <div className="flex items-center gap-3">
              <div
                onClick={() => postlikes(post._id)}
                className="cursor-pointer hover:scale-110 transition-transform"
              >
                {post.like.includes(myId!) ? (
                  <Heart color="red" fill="red" />
                ) : (
                  <Heart />
                )}
              </div>
              <div
                className="cursor-pointer hover:scale-110 transition-transform"
                onClick={() => pushComment(post._id)}
              >
                <MessageCircle />
              </div>
            </div>

            <div className="font-semibold text-sm">
              {post.like.length} likes
            </div>

            {/* Caption */}
            <div className="text-sm">
              <span className="font-semibold mr-2">{post?.user?.username}</span>
              {post?.caption}
            </div>

            {/* Comments */}
            <div
              className="text-gray-500 text-sm cursor-pointer hover:text-gray-700 transition-colors"
              onClick={() => pushComment(post._id)}
            >
              View all comments
            </div>

            <div
              className="text-gray-400 text-sm cursor-pointer hover:text-gray-600 transition-colors"
              onClick={() => pushComment(post._id)}
            >
              Add a comment…
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
export default Page;
