import { createContext, PropsWithChildren } from "react";

type ContextType = {
  login: (email: string, password: string) => Promise<void>;
};

export const AuthContext = createContext<ContextType | null>(null);

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const [user, setUser] = useState(null);
  const login = async (email: string, password: string) => {
    const response = fetch("http://localhost:5000/login", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    });

    const user = await response.json();
    setUser(user);
    localStorage.setItem("user", JSON.stringify(user));
  };
  return (
    <AuthContext.Provider value={{ login: login }}>
      {children}
    </AuthContext.Provider>
  );
};
