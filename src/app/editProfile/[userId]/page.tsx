"use client";
import { useEffect, useState, ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Default_Profile } from "@/icons/defualtProjile";

type upDatetype = {
  Name: string;
  Username: string;
  Bio: string;
};
const Page = () => {
  const [update, setUpdate] = useState();
  const [inputValues, setInputValues] = useState<upDatetype>({
    Name: "",
    Username: "",
    Bio: "",
  });

  return (
    <div>
      <div>
        <div className="text-center mt-8">Edit profile</div>
        <div>Edit profile</div>
        <div>
          <Default_Profile />
          <div></div>
        </div>
        <div>Name</div>
        <Input />
        <div>Username</div>
        <Input />
        <div>Bio</div>
        <Input />
      </div>
      <div>
        <Button>Submit</Button>
      </div>
    </div>
  );
};

export default Page;
