import { Button } from "../../../components/ui/button";
import AddQuestionDialog from "../../../components/AddQuestionDialog";
import { useEffect, useState } from "react";
import { api } from "../../../lib/api";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import Loader from "../../../components/Loader";
import { useHandbookContext } from "../../../contexts/HandbookContext";
import { jsonToHTML, jsonToText } from "../../../lib/utils";
import { generateQuestion } from "../../../ai/ai";
import EditGeneratedQuestionDialog from "../../../components/EditGeneratedQuestionDialog";
import { Plus, ClipboardList } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../../components/ui/dialog";

type GeneratedQuestion = Question;

const QuestionBank = () => {
  const { topics } = useHandbookContext();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isGeneratingQuestions, setIsGeneratingQuestions] = useState(false);
  const [isSavingGeneratedQuestions, setIsSavingGeneratedQuestions] =
    useState(false);
  const [deleteQuestionId, setDeleteQuestionId] = useState<string | null>(null);
  const [isTopicsDialogOpen, setIsTopicsDialogOpen] = useState(false);
  const [selectedSection, setSelectedSection] = useState<Section | null>(null);
  const [generatedQuestions, setGeneratedQuestions] = useState<
    GeneratedQuestion[]
  >([]);
  const [isGeneratedQuestionsDialogOpen, setIsGeneratedQuestionsDialogOpen] =
    useState(false);
  const [isGeneratedSaveSuccessOpen, setIsGeneratedSaveSuccessOpen] =
    useState(false);
  const [savedGeneratedCount, setSavedGeneratedCount] = useState(0);

  const pendingDeleteQuestion = questions.find(
    (q) => q._id === deleteQuestionId,
  );

  async function handleDelete(question_id: string) {
    try {
      setIsDeleting(true);
      await api.delete(`/questions/${question_id}`);
      setQuestions((prev) => prev.filter((q) => q._id !== question_id));
      setDeleteQuestionId(null);
    } finally {
      setIsDeleting(false);
    }
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

  function getSectionHtml(content: Section["content"]) {
    if (!content) return "<p>No content available.</p>";

    if (typeof content === "string") {
      return content;
    }

    try {
      return jsonToHTML(content);
    } catch {
      return "<p>No content available.</p>";
    }
  }

  function getSectionText(content: Section["content"]) {
    if (!content) return "";

    if (typeof content === "string") {
      return content;
    }

    try {
      return jsonToText(content);
    } catch {
      return "";
    }
  }

  async function handleGenerateQuestions() {
    if (!selectedSection) return;

    const selectedTopic = topics.find((topic) =>
      topic.sections.some((section) => section._id === selectedSection._id),
    );
    if (!selectedTopic) return;

    const text = getSectionText(selectedSection.content);
    if (!text.trim()) return;

    try {
      setIsGeneratingQuestions(true);
      const aiQuestions = (await generateQuestion(text)) as Array<{
        type: "multiple-choice" | "identification" | "true-or-false";
        question: string;
        answer: string;
        explanation?: string;
        choices?: string[] | string;
      }>;

      const enrichedQuestions: GeneratedQuestion[] = aiQuestions.map(
        (question) => ({
          _id: crypto.randomUUID(),
          question: question.question,
          answer: question.answer,
          type: question.type,
          explanation: question.explanation ?? "",
          choices:
            question.type === "multiple-choice"
              ? Array.isArray(question.choices)
                ? question.choices
                    .map((choice) => choice.trim())
                    .filter(Boolean)
                : (question.choices ?? "")
                    .split(",")
                    .map((choice) => choice.trim())
                    .filter(Boolean)
              : [],
          user_id: "",
          topic_id: selectedTopic._id,
          section_id: selectedSection._id,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }),
      );

      console.log("AI-generated questions:", enrichedQuestions);
      setGeneratedQuestions(enrichedQuestions);
      setIsGeneratedQuestionsDialogOpen(true);
    } catch (error) {
      console.error("Failed to generate questions:", error);
    } finally {
      setIsGeneratingQuestions(false);
    }
  }

  async function handleConfirmGeneratedQuestions() {
    if (!generatedQuestions.length) {
      setIsGeneratedQuestionsDialogOpen(false);
      setIsTopicsDialogOpen(false);
      setSelectedSection(null);
      return;
    }

    try {
      setIsSavingGeneratedQuestions(true);

      const responses = await Promise.all(
        generatedQuestions.map(async (question) => {
          const formData = new FormData();
          formData.append("topicId", question.topic_id);
          formData.append("sectionId", question.section_id);
          formData.append("type", question.type);
          formData.append("question", question.question);
          formData.append("answer", question.answer);
          formData.append("explanation", question.explanation ?? "");

          if (question.type === "multiple-choice") {
            formData.append("choices", JSON.stringify(question.choices ?? []));
          }

          return api.post("/questions", formData);
        }),
      );

      const createdQuestions = responses
        .map((res) => res?.data?.question as Question | undefined)
        .filter((question): question is Question => Boolean(question));

      if (createdQuestions.length > 0) {
        setQuestions((prev) => [...prev, ...createdQuestions]);
        setSavedGeneratedCount(createdQuestions.length);
        setIsGeneratedSaveSuccessOpen(true);
      }

      setGeneratedQuestions([]);
      setIsGeneratedQuestionsDialogOpen(false);
      setIsTopicsDialogOpen(false);
      setSelectedSection(null);
    } catch (error) {
      console.error("Failed to save generated questions:", error);
    } finally {
      setIsSavingGeneratedQuestions(false);
    }
  }

  function handleDeleteGeneratedQuestion(questionId: string) {
    setGeneratedQuestions((prev) => prev.filter((q) => q._id !== questionId));
  }

  return (
    <>
      <Loader show={isDeleting} text="Deleting..." />
      <Loader show={isGeneratingQuestions} text="Generating questions..." />
      <Loader show={isSavingGeneratedQuestions} text="Saving questions..." />

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
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsTopicsDialogOpen(true)}
              >
                AI Question Generation
              </Button>

              <AddQuestionDialog setQuestions={setQuestions}>
                <Button className="gap-2">
                  <Plus size={15} />
                  Add Question
                </Button>
              </AddQuestionDialog>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white border border-gray-200 rounded-md shadow-sm overflow-hidden">
            <DataTable
              data={questions}
              columns={columns(setDeleteQuestionId, topics, setQuestions)}
            />
          </div>
        </div>
      </div>

      <Dialog
        open={!!deleteQuestionId}
        onOpenChange={(open) => {
          if (!open) setDeleteQuestionId(null);
        }}
      >
        <DialogContent className="rounded max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Question?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. The selected question will be
              permanently removed.
            </DialogDescription>
          </DialogHeader>

          {pendingDeleteQuestion?.question && (
            <p className="text-sm text-muted-foreground border rounded p-3 line-clamp-3">
              {pendingDeleteQuestion.question}
            </p>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setDeleteQuestionId(null)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              disabled={isDeleting || !deleteQuestionId}
              onClick={() => {
                if (!deleteQuestionId) return;
                handleDelete(deleteQuestionId);
              }}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={isTopicsDialogOpen}
        onOpenChange={(open) => {
          setIsTopicsDialogOpen(open);
          if (!open) setSelectedSection(null);
        }}
      >
        <DialogContent className="rounded max-w-2xl max-h-[85vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle>Topics and Sections</DialogTitle>
            <DialogDescription>
              Browse all available topics and their sections.
            </DialogDescription>
          </DialogHeader>

          <div
            className={`overflow-y-auto space-y-4 ${selectedSection ? "max-h-[30vh]" : "max-h-[62vh]"}`}
          >
            {topics.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No topics available.
              </p>
            ) : (
              topics.map((topic) => (
                <div key={topic._id} className="border rounded p-3">
                  <p className="font-medium text-sm">{topic.title}</p>
                  {topic.sections.length === 0 ? (
                    <p className="text-sm text-muted-foreground mt-2">
                      No sections for this topic.
                    </p>
                  ) : (
                    <ul className="mt-2 space-y-1 text-sm">
                      {topic.sections.map((section) => (
                        <li key={section._id}>
                          <button
                            type="button"
                            className="w-full text-left px-2 py-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                            onClick={() => setSelectedSection(section)}
                          >
                            {section.title || "Untitled section"}
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))
            )}
          </div>

          {selectedSection && (
            <div className="border rounded p-3 bg-muted/20 max-h-[38vh] overflow-hidden flex flex-col">
              <p className="text-sm font-medium mb-3">
                {selectedSection.title || "Untitled section"}
              </p>
              <div
                className="flex-1 min-h-0 overflow-y-auto rounded border bg-white p-3 text-sm leading-6 text-foreground
                [&_p]:mb-4
                [&_strong]:font-semibold
                [&_em]:italic
                [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:mb-4
                [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:mb-4
                [&_li]:mb-1
                [&_a]:text-blue-600 [&_a]:underline"
                dangerouslySetInnerHTML={{
                  __html: getSectionHtml(selectedSection.content),
                }}
              />

              <div className="mt-3 flex justify-end">
                <Button
                  type="button"
                  disabled={isGeneratingQuestions}
                  onClick={handleGenerateQuestions}
                >
                  Generate Question
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog
        open={isGeneratedQuestionsDialogOpen}
        onOpenChange={setIsGeneratedQuestionsDialogOpen}
      >
        <DialogContent className="rounded max-w-2xl max-h-[85vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle>Generated Questions</DialogTitle>
            <DialogDescription>
              AI-generated questions based on the selected section content.
            </DialogDescription>
          </DialogHeader>

          <div className="overflow-y-auto space-y-3 max-h-[65vh] pr-1">
            {generatedQuestions.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No generated questions found.
              </p>
            ) : (
              generatedQuestions.map((question, index) => (
                <div
                  key={`${question.question}-${index}`}
                  className="border rounded p-3 space-y-2"
                >
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">
                    {question.type}
                  </p>
                  <p className="text-sm font-medium">{question.question}</p>
                  <p className="text-sm">
                    <span className="font-medium">Answer:</span>{" "}
                    {question.answer}
                  </p>

                  {question.choices.length > 0 &&
                    question.type === "multiple-choice" && (
                      <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
                        {question.choices.map((choice, choiceIndex) => (
                          <li key={`${choice}-${choiceIndex}`}>{choice}</li>
                        ))}
                      </ul>
                    )}

                  {question.explanation && (
                    <p className="text-sm text-muted-foreground">
                      <span className="font-medium text-foreground">
                        Explanation:
                      </span>{" "}
                      {question.explanation}
                    </p>
                  )}

                  <div className="flex items-center justify-end gap-2">
                    <Button
                      type="button"
                      variant="destructive"
                      onClick={() =>
                        handleDeleteGeneratedQuestion(question._id)
                      }
                    >
                      Delete
                    </Button>
                    <EditGeneratedQuestionDialog
                      question={question}
                      topics={topics}
                      setGeneratedQuestions={setGeneratedQuestions}
                    />
                  </div>
                </div>
              ))
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              disabled={isSavingGeneratedQuestions}
              onClick={handleConfirmGeneratedQuestions}
            >
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={isGeneratedSaveSuccessOpen}
        onOpenChange={setIsGeneratedSaveSuccessOpen}
      >
        <DialogContent className="rounded max-w-md">
          <DialogHeader>
            <DialogTitle>Questions Added</DialogTitle>
            <DialogDescription>
              Successfully added {savedGeneratedCount} generated question
              {savedGeneratedCount !== 1 ? "s" : ""} to the question bank.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              type="button"
              onClick={() => setIsGeneratedSaveSuccessOpen(false)}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default QuestionBank;
