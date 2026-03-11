import { useState, useEffect } from "react";
import { api } from "../lib/api";
import { handbookContext } from "../contexts/HandbookContext";

function HandbookProvider({ children }: { children: React.ReactNode }) {
  const [handbook, setHandbook] = useState<Handbook | null>(null);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [activeTopic, setActiveTopic] = useState<Topic | null>(null);
  const [activeSection, setActiveSection] = useState<Section | null>(null);

  useEffect(() => {
    async function getHandbook() {
      try {
        const res = await api.get("/handbooks");
        setHandbook(res.data.handbook);
        setTopics(res.data.handbook.topics);
      } catch (error) {
        console.error("Error fetching handbook data:", error);
      }
    }
    getHandbook();
  }, [activeTopic, activeSection]);

  if (!handbook) {
    return <div>Loading...</div>;
  }

  return (
    <handbookContext.Provider
      value={{
        handbook,
        setHandbook,
        topics,
        setTopics,
        activeTopic,
        setActiveTopic,
        activeSection,
        setActiveSection,
      }}
    >
      {children}
    </handbookContext.Provider>
  );
}

export default HandbookProvider;
