"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChangeEvent, useContext, useEffect } from "react";
import { AuthContext } from "@/providers/AuthProvider";
import { useUser } from "@/providers/AuthProvider";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Insta_Logo } from "@/icons/png-clipart-instagram-logo-computer-icons-logo-blog-instagram-purple-violet-thumbnail-removebg-preview 1";

const Page = () => {
  const { newUserSign, user } = useUser();
  const { push } = useRouter();

  // useEffect(() => {
  //   if (!user) push("/login");
  // }, []);
  const [sign, setSign] = useState({
    email: "",
    password: "",
    username: "",
  });

  const handleInput = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSign({
      ...sign,
      [name]: value,
    });
  };
  const pushToLogin = () => {
    push("/login");
  };
  const hangleSign = async () => {
    await newUserSign(sign.email, sign.password, sign.username);
  };
  console.log(sign);
  return (
    <div className="flex flex-col justify-center items-center">
      <div className="mb-10">
        <Insta_Logo />
      </div>
      <div className="font-bold text-gray-600 text-center pl-11 pr-11 mb-8">
        Sign up to see photos and videos from your friends
      </div>
      <Input
        className="w-70 m-2 bg-gray-100"
        placeholder="Email"
        name="email"
        value={sign.email}
        onChange={(e) => handleInput(e)}
      ></Input>
      <Input
        className="w-70 m-2 bg-gray-100"
        placeholder="Password"
        name="password"
        value={sign.password}
        onChange={(e) => handleInput(e)}
      ></Input>
      <Input
        className="w-70 m-2 bg-gray-100"
        placeholder="Username"
        name="username"
        value={sign.username}
        onChange={(e) => handleInput(e)}
      ></Input>
      <Button onClick={hangleSign} className="w-70 bg-blue-400 font-bold mt-6">
        Sign up
      </Button>
      <div className="mt-4.5">
        <div className="text-center">Have an account?</div>
        <div
          className="text-center font-bold text-blue-400"
          onClick={pushToLogin}
        >
          Log in
        </div>
      </div>
    </div>
  );
};

export default Page;
