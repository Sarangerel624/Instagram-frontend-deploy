"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useContext } from "react";
import { AuthContext } from "@/providers/AuthProvider";
const Page = () => {
   const {login} = useContext(AuthContext)
  return (
    <div>
      <Input placeholder="write a email pls..." />
      <Input placeholder="write a email pls..." />
      <Button>login</Button>
    </div>
  );
};

export default Page;