"use client";

import {
  createContext,
  PropsWithChildren,
  useState,
  Dispatch,
  useContext,
  SetStateAction,
  useEffect,
} from "react";

import { useRouter } from "next/navigation";
import { toast } from "sonner";

type User = {
  username: string;
  email: string;
  password: string;
  profilePicture: string | null;
  bio: string | null;
};

type newIgSignUser = {
  fullName: string;
  username: string;
  email: string;
  password: string;
  profilePicture: string | null;
  bio: string | null;
};
type ContextType = {
  user: User | null;
  setUser: Dispatch<SetStateAction<null | User>>;
  login: (email: string, password: string) => Promise<void>;
  newUserSign: (
    email: string,
    password: string,
    username: string
  ) => Promise<void>;
};

export const AuthContext = createContext<ContextType | null>(null);

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const { push } = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [signup, setSignUp] = useState<User | null>(null);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const login = async (email: string, password: string) => {
    const response = await fetch("http://localhost:5000/login", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    });

    if (response.ok) {
      const user = await response.json();
      localStorage.setItem("user", JSON.stringify(user));
      setUser(user);
      push("/");
      toast.success("Login successfully bro :))");
    } else {
      toast.error("Login failed bro :((");
    }
  };

  const newUserSign = async (
    email: string,
    password: string,
    username: string
  ) => {
    const createdUser = await fetch("http://localhost:5000/user", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        password: password,
        username: username,
      }),
    });
    if (createdUser.ok) {
      const signUpUser = await createdUser.json();
      localStorage.setItem("signUpUser", JSON.stringify(signUpUser));
      setSignUp(signUpUser);
      push("/login");
      toast.success("Successfully registered");
    } else {
      toast.error("User is already registered");
    }
  };
  const values = {
    user,
    setUser,
    login,
    newUserSign,
  };

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>;
};

export const useUser = () => {
  const authContext = useContext(AuthContext);

  if (!authContext) {
    throw new Error("provider dotor baih heregtei");
  }
  return authContext;
};
