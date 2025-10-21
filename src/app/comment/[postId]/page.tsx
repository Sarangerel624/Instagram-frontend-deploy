"use client";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Smile } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useUser } from "@/providers/AuthProvider";
import { Default_Profile } from "@/icons/defualtProjile";
import { useState, ChangeEvent, useEffect } from "react";

type commentDataPostType = {
  caption : string,
  comment : string[],
  comments : string[],
  user : {
    username : string,
    profilePicture: string[],
  }
}

type commentDataUserType = {
  profilePicture : string[],
  username: string
}
type commentDataType = {
  comment : string,
  post : commentDataPostType,
  user : commentDataUserType
}
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
      body:  JSON.stringify({
        user: user?._id,
        postId: postId,
        comment: comment,
      }),
    });

    if (response.ok) {
      const res = await response.json();
      setComment(res);
      commentsFetch()
    }
  };


  useEffect(() => {
    if (token) {
      commentsFetch();
    }
  }, [token]);
    console.log(commentData, "commentdataaa")
  return (
    <div>
      <div className="text-center font-bold mt-9 border-b-1 p-2">Comments</div>
      <div className="flex gap-2 border-b-1 p-2">
         <Default_Profile />
         <div className="font-bold">{commentData[0]?.post?.user?.username}</div>
         <div>{commentData[0]?.post?.caption}</div>
      </div >
      <div className="flex gap-3">
        <Input
          placeholder="add a comment..."
          value={comment}
          onChange={(e) => handleInputValue(e)}
          className="w-[300px]"
        />
       <div>
         <Button onClick={createdComment}>Comment</Button>
       </div>
      </div>

      <div className="mt-4">
        {commentData.map((comment , index) => {
          return(
            <div key={index} className="flex gap-2 mt-3">
                <Default_Profile />
                 <div className="font-bold mt-2">{comment?.user?.username}</div>
                <div className="mt-2">{comment?.comment}</div>
            </div>
          )
        })}
      </div>
     
    </div>
  );
};

export default Page;
