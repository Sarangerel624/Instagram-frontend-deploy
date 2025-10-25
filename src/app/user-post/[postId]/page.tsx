"use client";
import { useEffect, useState, ChangeEvent } from "react";
import { useParams } from "next/navigation";
import { useUser } from "@/providers/AuthProvider";
import { Default_Profile } from "@/icons/defualtProjile";
import { Heart } from "lucide-react";
import { MessageCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { Ellipsis } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

type UserType = {
  username: string;
  profilePic: string[];
  followers: string[];
  following: string[];
};
type UserPostType = {
  caption: string;
  comment: string[];
  comments: string[];
  images: string[];
  like: string[];
  profilePic: string[];
  user: UserType;
};
const Page = () => {
  const [userPost, setUserPost] = useState<UserPostType>();
  const params = useParams();

  const { token, setToken, user } = useUser();
  const { push } = useRouter();
  const myId = user?._id;
  const postId = params.postId;
  const fetchPosts = async () => {
    const response = await fetch(
      `http://localhost:5000/userPostyee/${postId}`,
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
      fetchPosts();
    }
  };

  const pushComment = (userId: string) => {
    push(`/comment/${userId}`);
  };

  const deletePost = async (postId: string) => {
    const response = await fetch(`/userPostDelete/${postId}`, {
      method: "DELETE",
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    if (response.ok) {
      push(`profile/${myId}`);
    }
  };

  useEffect(() => {
    if (token) {
      fetchPosts();
    }
  }, [token]);

  console.log(userPost);
  return (
    <div className="mt-10">
      <div className="flex justify-between">
        <div className="flex gap-3">
          <Default_Profile />
          <div className="mt-2 font-bold">{userPost?.user?.username}</div>
        </div>
        <div className="mr-3 mt-2">
          <Dialog>
            <DialogTrigger>
              <Ellipsis />
            </DialogTrigger>
            <DialogTitle></DialogTitle>
            <DialogContent>
              <DialogDescription
                className="text-red-600 font-bold"
                onClick={deletePost}
              >
                Delete
              </DialogDescription>
              <DialogDescription className="font-bold">Edit</DialogDescription>
              <DialogDescription className="font-bold">
                Cancel
              </DialogDescription>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      <img src={userPost?.images[0]} className="mt-2"></img>
      <div className="flex gap-2">
        <div onClick={() => postlikes(postId)}>
          {userPost?.like.includes(myId!) ? (
            <Heart color="red" fill="red" />
          ) : (
            <Heart />
          )}
        </div>
        <div>{userPost?.like.length}</div>
        <div onClick={() => pushComment(postId)}>
          <MessageCircle />
        </div>
      </div>
      <div className="flex gap-2">
        <div className="font-bold">{userPost?.user?.username}</div>
        <div>{userPost?.caption}</div>
      </div>
      <div>
        <div className="text-gray-500">
          All view {userPost?.comments.length} comments
        </div>
        <div className="text-gray-500" onClick={() => pushComment(postId)}>
          Add a comment...
        </div>
      </div>
    </div>
  );
};

export default Page;
