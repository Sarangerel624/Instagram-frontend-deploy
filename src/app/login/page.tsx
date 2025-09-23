"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChangeEvent, useContext } from "react";
import { AuthContext } from "@/providers/AuthProvider";
import { useUser } from "@/providers/AuthProvider";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Insta_Logo } from "@/icons/png-clipart-instagram-logo-computer-icons-logo-blog-instagram-purple-violet-thumbnail-removebg-preview 1";
type InputValues = {
  password: string;
  email: string;
};
const Page = () => {
  const { push } = useRouter();
  const { login, user } = useUser();

  useEffect(() => {
    if (user) push("/");
  }, [user]);

  const [checks, setChecks] = useState<InputValues>({
    password: "",
    email: "",
  });

  const handleInputValue = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setChecks({
      ...checks,
      [name]: value,
    });
  };
  const pushToSign = () => {
    push("/sign-up");
  };
  const handleLogin = async () => {
    await login(checks.email, checks.password);
  };

  return (
    <div className="flex flex-col justify-center items-center">
      <div className="mb-20">
        <Insta_Logo />
      </div>
      <div className="flex flex-col gap-2">
        <Input
          placeholder="Email"
          name="email"
          value={checks.email}
          onChange={(e) => handleInputValue(e)}
          className="border-b bg-gray-100 h-10 w-70"
        />
        <Input
          placeholder="Password"
          name="password"
          value={checks.password}
          onChange={(e) => handleInputValue(e)}
          className="border-b bg-gray-100 h-10 w-70"
        />
      </div>
      <Button
        onClick={handleLogin}
        className="bg-blue-400 h-10 w-70 font-bold mt-6"
      >
        Log in
      </Button>
      <div className="mt-4.5">
        <div className="text-center">Have an account?</div>
        <div
          className="text-center font-bold text-blue-400"
          onClick={pushToSign}
        >
          Sign up
        </div>
      </div>
    </div>
  );
};

export default Page;
