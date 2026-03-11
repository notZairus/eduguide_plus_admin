import { authContext } from "../contexts/AuthContext";
import { useState } from "react";

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [auth, setAuth] = useState<User | null>(null);

  return (
    <>
      <authContext.Provider value={{ auth, setAuth }}>
        {children}
      </authContext.Provider>
    </>
  );
};

export default AuthProvider;
