interface Topic {
  _id: string;
  title: string;
  order: number;
  sections: Section[];
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
  medias: StoredMedia;
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
