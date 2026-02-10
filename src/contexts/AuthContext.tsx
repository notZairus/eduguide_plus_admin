import { createContext, useContext, useState, type SetStateAction } from "react";


const authContext = createContext< null | {
  auth: User | null,
  setAuth: React.Dispatch<SetStateAction<User | null>>
}>(null);


export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [auth, setAuth] = useState<User | null>(null);

  return  (
    <>
      <authContext.Provider value={{ auth, setAuth }}>
        { children }
      </authContext.Provider>
    </>
  )
}


export const useAuthContext = () => {
  const context = useContext(authContext);
  if (!context) throw new Error("use of auth context out of its provider.");
  return context;
}