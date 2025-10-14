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
import { jwtDecode } from "jwt-decode";
type User = {
  _id: string;
  username: string;
  email: string;
  password: string;
  profilePicture: string | null;
  bio: string | null;
  followers: string[];
  following: string[];
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
  setToken: Dispatch<SetStateAction<null | string>>;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  newUserSign: (
    email: string,
    password: string,
    username: string
  ) => Promise<void>;
};

type DecodedType = {
  data: User;
};

export const AuthContext = createContext<ContextType | null>(null);

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const { push } = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const localToken = localStorage.getItem("token");
    if (localToken) {
      const decodedToken: DecodedType = jwtDecode(localToken);
      setUser(decodedToken.data);
      setToken(localToken);
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
      const localToken = await response.json();
      localStorage.setItem("token", localToken);
      setToken(localToken);
      const decodedToken: DecodedType = jwtDecode(localToken);
      setUser(decodedToken.data);
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
        email,
        password,
        username,
      }),
    });
    if (createdUser.ok) {
      const signUpUser = await createdUser.json();
      localStorage.setItem("token", signUpUser);

      const decodedToken: DecodedType = jwtDecode(signUpUser);
      setUser(decodedToken.data);
      setToken(signUpUser);
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
    token,
    setToken,
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
