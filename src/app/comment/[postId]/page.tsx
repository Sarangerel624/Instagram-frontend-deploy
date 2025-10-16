"use client";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Smile } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useUser } from "@/providers/AuthProvider";
import { Default_Profile } from "@/icons/defualtProjile";
import { useState, ChangeEvent, useEffect } from "react";

const Page = () => {
  const { token, user, setToken } = useUser();
  const [commentValue, setCommentValue] = useState("");
  const [comment, setComment] = useState([]);
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
      setComment(res);
    }
  };

  const createdComment = async () => {
    const response = await fetch(`http://localhost:5000/comment/${postId}`, {
      method: "GET",
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: {
        user: user?._id,
        post: postId,
        comment: commentValue,
      },
    });

    if (response.ok) {
      const res = await response.json();
      setComment(res);
    }
  };

  const createComments = () => {
    createdComment();
  };
  useEffect(() => {
    if (token) {
      commentsFetch();
    }
  }, [token]);

  return (
    <div>
      <div className="text-center font-bold mt-9 border-b-1 p-2">Comments</div>
      <Default_Profile />
      <div></div>
      {/* <div>{comment[0].post.caption}</div> */}
      <div className="flex gap-3 ">
        <Input
          placeholder="add a comment..."
          value={commentValue}
          onChange={(e) => handleInputValue(e)}
          className="w-[300px]"
        />
        <Button onClick={createComments}>Comment</Button>
      </div>
    </div>
  );
};

export default Page;
