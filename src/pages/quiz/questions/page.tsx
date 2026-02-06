import { Input } from "../../../components/ui/input";
import { Button } from "../../../components/ui/button";
import AddQuestionDialog from "../../../components/AddQuestionDialog";
import { useEffect, useState } from "react";
import { api } from "../../../lib/api";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import Loader from "../../../components/Loader";

const QuestionBank = () => {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleDelete(question_id: string) {
    setIsDeleting(true);
    await api.delete(`/questions/${question_id}`);

    const copy = questions.slice();
    const filtered = copy.filter((q) => q._id !== question_id);
    setQuestions(filtered);
    setIsDeleting(false);
  }

  useEffect(() => {
    const fetchTopics = async () => {
      const res = await api.get("/topics");
      if (res.status === 200) {
        setTopics(res.data.topics);
      }
    };

    fetchTopics();
  }, []);

  useEffect(() => {
    const fetchQuestions = async () => {
      const res = await api.get("/questions");
      if (res.status === 200) {
        console.log(res.data.questions);
        setQuestions(res.data.questions);
      }
    };

    fetchQuestions();
  }, []);

  if (!questions) return <p>loading...</p>;

  return (
    <>
      <Loader show={isDeleting} text="Deleting..." />

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
            <AddQuestionDialog topics={topics} setQuestions={setQuestions} />
          </div>
        </header>
        <div className="mt-8">
          <div className="w-full overflow-auto">
            <DataTable data={questions} columns={columns(handleDelete)} />
          </div>
        </div>
      </div>
    </>
  );
};

export default QuestionBank;
