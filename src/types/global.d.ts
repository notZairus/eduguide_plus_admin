interface Handbook {
  _id: string;
  code: string;
  title: string;
  color?: string;
  description?: string;
  topics: Topic[];
  user_id: string;
  logo?: {
    url: string;
  };
  thumbnail?: {
    url: string;
  };
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface Topic {
  _id: string;
  title: string;
  order: number;
  sections: Section[];
  active_quiz?: Quiz;
  updatedAt?: string;
  createdAt?: string;
}

type StoredMedia = {
  url: string;
  type: string;
};

interface Section {
  _id: string;
  title?: string;
  order: number;
  content: unknown;
  medias: StoredMedia[];
  updatedAt?: string;
  createdAt?: string;
}

interface Question {
  question: string;
  answer: string;
  type: "multiple-choice" | "identification" | "true-or-false";
  explanation?: string;
  choices: string[];
  media?: {
    url: string;
    public_id: string;
    type: "image" | "video";
  };
  topic_id: string;
  section_id: string;
  user_id: string;
  _id: string;
  createdAt: string;
  updatedAt: string;
}

interface Quiz {
  title: string;
  linked_topic: string;
  passing_score: number;
  time_timit: number | null;
  enable_time_limit: boolean;
  shuffle: boolean;
  instant_feedback: boolean;
  _id: string;
  questions?: Question[];
  createdAt: string;
  updatedAt: string;
}

interface User {
  _id: string;
  firstName: string;
  middleName: string;
  lastName: string;
  isAdmin: boolean;
}
