import { Button } from "../../../components/ui/button";
import AddQuestionDialog from "../../../components/AddQuestionDialog";
import { useEffect, useState } from "react";
import { api } from "../../../lib/api";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import Loader from "../../../components/Loader";
import { useHandbookContext } from "../../../contexts/HandbookContext";
import { Plus, ClipboardList } from "lucide-react";

const QuestionBank = () => {
  const { topics } = useHandbookContext();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleDelete(question_id: string) {
    setIsDeleting(true);
    await api.delete(`/questions/${question_id}`);
    setQuestions((prev) => prev.filter((q) => q._id !== question_id));
    setIsDeleting(false);
  }

  useEffect(() => {
    const fetchQuestions = async () => {
      const res = await api.get("/questions");
      if (res.status === 200) {
        setQuestions(res.data.questions);
      }
    };
    fetchQuestions();
  }, []);

  return (
    <>
      <Loader show={isDeleting} text="Deleting..." />

      <div className="min-h-screen bg-gray-50/60 p-6">
        <div className="max-w-6xl mx-auto">
          {/* Page Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 text-white">
                <ClipboardList size={20} />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900 tracking-tight">
                  Question Bank
                </h1>
                <p className="text-xs text-gray-500 mt-0.5">
                  {questions.length} question{questions.length !== 1 ? "s" : ""}{" "}
                  total
                </p>
              </div>
            </div>
            <AddQuestionDialog setQuestions={setQuestions}>
              <Button className="gap-2">
                <Plus size={15} />
                Add Question
              </Button>
            </AddQuestionDialog>
          </div>

          {/* Table */}
          <div className="bg-white border border-gray-200 rounded-md shadow-sm overflow-hidden">
            <DataTable
              data={questions}
              columns={columns(handleDelete, topics, setQuestions)}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default QuestionBank;
