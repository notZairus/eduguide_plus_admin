import { createContext, useContext, type SetStateAction } from "react";

export const authContext = createContext<null | {
  auth: User | null;
  setAuth: React.Dispatch<SetStateAction<User | null>>;
}>(null);

export const useAuthContext = () => {
  const context = useContext(authContext);
  if (!context) throw new Error("use of auth context out of its provider.");
  return context;
};
