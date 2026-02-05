import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import AddQuestionDialog from "../../components/AddQuestionDialog";
import { useEffect, useState } from "react";
import { api } from "../../lib/api";

const QuestionBank = () => {
  const [topics, setTopics] = useState<Topic[]>([]);

  useEffect(() => {
    const fetchTopics = async () => {
      const res = await api.get("/topics");
      if (res.status === 200) {
        setTopics(res.data.topics);
      }
    };

    fetchTopics();
  }, []);

  return (
    <div className="w-full h-full">
      <header className="w-full bh-white shadow border rounded p-4 flex items-center justify-around">
        <div className=" flex w-150">
          <Input
            placeholder="Search a keyword."
            type="text"
            name="search"
            className="rounded-r-none rounded-l"
          />
          <Button className="rounded-l-none">Search</Button>
        </div>
        <div>
          <AddQuestionDialog topics={topics} />
        </div>
      </header>
      <div className="p-8">the question list will appear here</div>
    </div>
  );
};

export default QuestionBank;
