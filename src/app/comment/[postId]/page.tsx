"use client";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Smile } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useUser } from "@/providers/AuthProvider";
import { Default_Profile } from "@/icons/defualtProjile";
import { useState, ChangeEvent, useEffect } from "react";
import { Footer } from "@/app/_components/Footer";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useRouter } from "next/navigation";
import { CircleEllipsis } from "lucide-react";
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

type commentDataPostType = {
  caption: string;
  comment: string[];
  comments: string[];
  user: {
    username: string;
    profilePicture: string[];
    _id: string;
  };
};

type commentDataUserType = {
  profilePicture: string[];
  username: string;
  _id: string;
};
type commentDataType = {
  _id: string;
  comment: string;
  post: commentDataPostType;
  user: commentDataUserType;
};
const Page = () => {
  const { token, user, setToken } = useUser();
  const [comment, setCommentValue] = useState("");
  const [comments, setComment] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [commentData, setCommentData] = useState<commentDataType[]>([]);
  const params = useParams();
  const [postData, setPostData] = useState([]);
  const { push } = useRouter();
  const handleInputValue = (e: ChangeEvent<HTMLInputElement>) => {
    setCommentValue(e.target.value);
  };

  const postId = params.postId;
  console.log(postId);

  const commentsFetch = async () => {
    const response = await fetch(
      `https://insta-backend-gbdi.onrender.com/getPosts/${postId}`,
      {
        method: "GET",
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.ok) {
      const res = await response.json();
      setCommentData(res);
    }
  };

  const createdComment = async () => {
    const response = await fetch(
      `https://insta-backend-gbdi.onrender.com/comment`,
      {
        method: "POST",
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          user: user?._id,
          postId: postId,
          comment: comment,
        }),
      }
    );

    if (response.ok) {
      const res = await response.json();
      setComment(res);
      commentsFetch();
    }
  };

  console.log("commentId");
  const deleteComment = async (postsId: string) => {
    const response = await fetch(
      `https://insta-backend-gbdi.onrender.com/deleteComment`,
      {
        method: "DELETE",
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          _id: postsId,
        }),
      }
    );

    if (response.ok) {
      const res = await response.json();
      setComment(res);
      commentsFetch();
    }
  };

  const editComment = async (commentId: string) => {
    const response = await fetch(
      `https://insta-backend-gbdi.onrender.com/editComment`,
      {
        method: "POST",
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          _id: commentId,
          newComment: newComment,
        }),
      }
    );

    if (response.ok) {
      commentsFetch();
    }
  };

  const pushToUserProfile = (userId: string) => {
    push(`/profile/${userId}`);
  };

  useEffect(() => {
    if (token) {
      commentsFetch();
    }
  }, [token]);
  console.log(newComment);

  return (
    <div className="bg-white rounded-lg shadow-md p-5 max-w-lg mx-auto mt-10 flex flex-col justify-between">
      <div className="text-center text-lg font-semibold border-b pb-2 mb-4 text-gray-700">
        Comments
      </div>
      <div className="flex items-start gap-3 border-b pb-3 mb-3">
        <Default_Profile />
        <div>
          <div className="font-semibold text-gray-800">
            {commentData[0]?.post?.user?.username}
          </div>
          <div className="text-gray-600 text-sm">
            {commentData[0]?.post?.caption}
          </div>
        </div>
      </div>

      <div className="space-y-3 mb-4 max-h-[300px] overflow-y-auto pr-1">
        {commentData.map((comment, index) => (
          <div
            key={index}
            className="flex items-start gap-3 bg-gray-50 rounded-md p-2 hover:bg-gray-100 transition"
          >
            <Avatar
              className="cursor-pointer h-11 w-11 ring-1 ring-gray-200"
              onClick={() => pushToUserProfile(comment.user._id)}
            >
              <AvatarImage
                src={comment?.user?.profilePicture?.[0]}
                alt={comment?.user?.username}
              />
              <AvatarFallback>
                {comment?.user?.username?.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>

            <div className="flex gap-30">
              <div>
                <div className="font-semibold text-gray-800">
                  {comment?.user?.username}
                </div>
                <div className="text-gray-700 text-sm">{comment?.comment}</div>
              </div>
              <div>
                <Dialog>
                  <DialogTrigger>
                    <CircleEllipsis />
                  </DialogTrigger>
                  <DialogTitle></DialogTitle>
                  <DialogContent>
                    <DialogFooter>
                      <Button
                        className="w-30 ml-3"
                        onClick={() => deleteComment(comment._id)}
                      >
                        delete comment
                      </Button>
                      <Button onClick={() => editComment(comment._id)}>
                        edit comment
                      </Button>
                      <Input
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="edit a comment"
                      />
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-2 items-center border-t pt-3">
        <Input
          placeholder="Add a comment..."
          value={comment}
          onChange={(e) => handleInputValue(e)}
          className="w-full rounded-md border border-gray-300 focus:ring-2 focus:ring-green-500"
        />
        <Button
          onClick={createdComment}
          className="bg-green-600 text-white px-4 py-2 rounded-md"
        >
          Comment
        </Button>
      </div>
      <Footer />
    </div>
  );
};

export default Page;
