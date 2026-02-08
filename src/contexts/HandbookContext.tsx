import { createContext, useContext, useEffect, useState } from "react";
import { api } from "../lib/api";

const handbookContext = createContext<{
  handbook: Handbook | null;
  setHandbook: (handbook: Handbook | null) => void;
} | null>(null);

export function HandbookProvider({ children }: { children: React.ReactNode }) {
  const [handbook, setHandbook] = useState<Handbook | null>(null);

  useEffect(() => {
    async function getHandbook() {
      try {
        const res = await api.get("/handbooks");
        setHandbook(res.data.handbook);
      } catch (error) {
        console.error("Error fetching handbook data:", error);
      }
    }
    getHandbook();
  }, []);

  if (!handbook) {
    return <div>Loading...</div>;
  }

  return (
    <handbookContext.Provider value={{ handbook, setHandbook }}>
      {children}
    </handbookContext.Provider>
  );
}

export function useHandbookContext() {
  const context = useContext(handbookContext);
  if (!context) {
    throw new Error(
      "useHandbookContext must be used within a HandbookProvider",
    );
  }
  return context;
}
