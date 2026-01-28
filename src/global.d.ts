interface Topic {
  _id: string;
  title: string;
  order: number;
  sections: Section[];
  updatedAt?: string;
  createdAt?: string;
}

interface Section {
  _id: string;
  title?: string;
  content?: null;
  updatedAt?: string;
  createdAt?: string;
}
