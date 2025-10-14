"use client";

import { Default_Profile } from "@/icons/defualtProjile";
import { Like_comment_logo } from "@/icons/Frame 16";
import { Ig_Logo } from "@/icons/image 5";
import { useEffect, useState } from "react";
import { useUser } from "@/providers/AuthProvider";
import { useRouter } from "next/navigation";
import { Heart } from "lucide-react";
import { MessageCircle } from "lucide-react";
import { toast } from "sonner";
type Post = {
  profilePicture: string;
  images: string;
  caption: string;
  like: string;
  comment: string;
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

  const pushComment = () => {
    push(`/post/comments `);
  };
  useEffect(() => {
    if (token) {
      allposts();
    }
  }, [token]);

  return (
    <div>
      {posts.map((post, index) => {
        return (
          <div key={index}>
            <div className="flex flex-row gap-2.5 mt-9">
              <div className="mb-2" onClick={() => pushToUserProfile}>
                <Default_Profile />
              </div>
              <div
                className="font-bold w-36 mt-1"
                onClick={() => pushToUserProfile(post.user._id)}
              >
                {post?.user.username}
              </div>
            </div>
            <img src={post.images} />
            <div className="m-1">
              <div className="flex gap-2">
                <div onClick={() => postlikes(post._id)}>
                  {post.like.includes(myId!) ? (
                    <Heart color="red" fill="red" />
                  ) : (
                    <Heart />
                  )}
                </div>
                <div>{post.like.length}</div>
                <div>
                  <MessageCircle />
                </div>
              </div>
              <div className="font-bold">{post.like.length} likes</div>
              <div className="flex gap-2">
                <div className="font-bold">{post?.user.username}</div>
                <div> {post?.caption}</div>
              </div>
              <div className="text-gray-500" onClick={pushComment}>
                All view {post.comment.length} comments
              </div>
              <div className="text-gray-500">Add a comment...</div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
export default Page;
