"use client";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Smile } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useUser } from "@/providers/AuthProvider";
import { Default_Profile } from "@/icons/defualtProjile";
import { useState, ChangeEvent, useEffect } from "react";

type commentDataPostType = {
  caption: string;
  comment: string[];
  comments: string[];
  user: {
    username: string;
    profilePicture: string[];
  };
};

type commentDataUserType = {
  profilePicture: string[];
  username: string;
};
type commentDataType = {
  comment: string;
  post: commentDataPostType;
  user: commentDataUserType;
};
const Page = () => {
  const { token, user, setToken } = useUser();
  const [comment, setCommentValue] = useState("");
  const [comments, setComment] = useState([]);
  const [commentData, setCommentData] = useState<commentDataType[]>([]);
  const params = useParams();
  const [postData, setPostData] = useState([]);
  const handleInputValue = (e: ChangeEvent<HTMLInputElement>) => {
    setCommentValue(e.target.value);
  };

  const postId = params.postId;
  console.log(postId);

  const commentsFetch = async () => {
    const response = await fetch(`http://localhost:5000/getPosts/${postId}`, {
      method: "GET",
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      const res = await response.json();
      setCommentData(res);
    }
  };

  const createdComment = async () => {
    const response = await fetch(`http://localhost:5000/comment`, {
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
    });

    if (response.ok) {
      const res = await response.json();
      setComment(res);
      commentsFetch();
    }
  };

  useEffect(() => {
    if (token) {
      commentsFetch();
    }
  }, [token]);
  console.log(commentData, "commentdataaa");
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
            <Default_Profile />
            <div>
              <div className="font-semibold text-gray-800">
                {comment?.user?.username}
              </div>
              <div className="text-gray-700 text-sm">{comment?.comment}</div>
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
    </div>
  );
};

export default Page;
