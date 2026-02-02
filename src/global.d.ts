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
