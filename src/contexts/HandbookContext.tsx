import { createContext, useContext } from "react";

export const handbookContext = createContext<{
  handbook: Handbook | null;
  setHandbook: (handbook: Handbook | null) => void;
  topics: Topic[];
  setTopics: (topics: Topic[]) => void;
  sections: Section[];
  setSections: (sections: Section[]) => void;
  activeTopic: Topic | null;
  setActiveTopic: (topic: Topic | null) => void;
  activeSection: Section | null;
  setActiveSection: (section: Section | null) => void;
} | null>(null);

export function useHandbookContext() {
  const context = useContext(handbookContext);
  if (!context) {
    throw new Error(
      "useHandbookContext must be used within a HandbookProvider",
    );
  }
  return context;
}
