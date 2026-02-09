import { useEffect, useState, type FormEvent } from "react";
import { DndContext, closestCenter, type DragEndEvent } from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useSortable } from "@dnd-kit/sortable";

import { Button } from "../../components/ui/button";
import { Card } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Separator } from "../../components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";

import { Plus, X, GripVertical, Image, Video, ChevronDown } from "lucide-react";
import { api } from "../../lib/api";

interface QuizFormData {
  title: string;
  linkedTopic: string;
  passingScore: number;
  timeLimit: number | null;
  enableTimeLimit: boolean;
  shuffle: boolean;
  instantFeedback: boolean;
}

function DraggableQuestionCard({
  question,
  onRemove,
}: {
  question: Question;
  onRemove: (question: Question) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: question._id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-white border rounded-lg p-4 flex items-start gap-3 hover:shadow-md transition-shadow"
    >
      <button
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600 shrink-0"
        type="button"
      >
        <GripVertical size={20} />
      </button>

      <div className="flex-1 min-w-0">
        <p className="text-sm text-gray-700 line-clamp-2">
          {question.question}
        </p>
        <div className="flex items-center gap-2 mt-2">
          {question.media && question.media.type === "image" && (
            <span className="inline-flex items-center gap-1 text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
              <Image size={14} /> Image
            </span>
          )}
          {question.media && question.media.type === "video" && (
            <span className="inline-flex items-center gap-1 text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">
              <Video size={14} /> Video
            </span>
          )}
        </div>
      </div>

      <button
        onClick={() => {
          onRemove(question);
        }}
        className="text-red-500 hover:text-red-700 shrink-0"
        type="button"
      >
        <X size={20} />
      </button>
    </div>
  );
}

const initialFormData = {
  title: "",
  linkedTopic: "",
  passingScore: 75,
  timeLimit: null,
  enableTimeLimit: false,
  shuffle: false,
  instantFeedback: false,
};

const QuizCreator = () => {
  const [formData, setFormData] = useState<QuizFormData>(initialFormData);

  const [topics, setTopics] = useState<Topic[]>([]);

  const [selectedQuestions, setSelectedQuestions] = useState<Question[]>([]);
  const [showQuestionBank, setShowQuestionBank] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);

  const availableQuestions = questions.filter(
    (q) => q.topic_id === formData.linkedTopic,
  );

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const data = {
      ...formData,
      questions: selectedQuestions.map((q) => q._id),
    };

    try {
      const res = await api.post("/quizzes", data);
      console.log("Quiz created successfully:", res.data);
      setFormData(initialFormData);
      setQuestions([...questions, ...selectedQuestions]);
      setSelectedQuestions([]);
    } catch (error) {
      console.error("Error creating quiz:", error);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setSelectedQuestions((items) => {
        const oldIndex = items.findIndex((q) => q._id === active.id);
        const newIndex = items.findIndex((q) => q._id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const handleInputChange = (field: keyof QuizFormData, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleToggle = (
    field: "enableTimeLimit" | "shuffle" | "instantFeedback",
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  useEffect(() => {
    async function fetchTopics() {
      try {
        const res = await api.get("/topics");
        setTopics(res.data.topics);
      } catch (error) {
        console.error("Error fetching topics:", error);
      }
    }

    async function fetchQuestions() {
      try {
        const res = await api.get("/questions");
        setQuestions(res.data.questions);
      } catch (error) {
        console.error("Error fetching questions:", error);
      }
    }

    fetchTopics();
    fetchQuestions();
  }, []);

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Create New Quiz</h1>
          <p className="text-gray-600 mt-2">
            Build an engaging quiz by defining settings and selecting questions
          </p>
        </div>

        {/* Quiz Header - General Settings */}
        <Card className="p-6 mb-6 bg-white rounded">
          <div className="flex items-center gap-2 mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              Quiz Identity
            </h2>
          </div>

          <div className="space-y-6">
            {/* Quiz Title */}
            <div>
              <Label
                htmlFor="quiz-title"
                className="text-sm font-medium text-gray-700"
              >
                Quiz Title
              </Label>
              <Input
                id="quiz-title"
                placeholder="e.g., Admission Policy Mastery"
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                className="rounded mt-2 w-full"
              />
            </div>

            <div className="rounded grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Linked topic */}
              <div>
                <Label className="rounded text-sm font-medium text-gray-700 block mb-2">
                  Linked Topic
                </Label>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      className="rounded w-full justify-between"
                    >
                      {formData.linkedTopic
                        ? topics.find((t) => t._id === formData.linkedTopic)
                            ?.title || "Select a topic"
                        : "Select a topic"}
                      <ChevronDown size={16} />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="rounded w-full">
                    {topics.map((topic) => (
                      <DropdownMenuItem
                        key={topic._id}
                        onClick={() => {
                          handleInputChange("linkedTopic", topic._id);
                        }}
                      >
                        {topic.title}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Passing Score */}
              <div>
                <Label
                  htmlFor="passing-score"
                  className="text-sm font-medium text-gray-700"
                >
                  Passing Score (%)
                </Label>
                <div className="mt-2 rounded flex items-center gap-3">
                  <Input
                    id="passing-score"
                    type="number"
                    min="0"
                    max="100"
                    value={formData.passingScore}
                    onChange={(e) =>
                      handleInputChange(
                        "passingScore",
                        parseInt(e.target.value),
                      )
                    }
                    className="rounded w-24"
                  />
                  <span className="text-sm text-gray-600">%</span>
                  <Input
                    type="range"
                    min="0"
                    max="100"
                    value={formData.passingScore}
                    onChange={(e) =>
                      handleInputChange(
                        "passingScore",
                        parseInt(e.target.value),
                      )
                    }
                    className="rounded flex-1"
                  />
                </div>
              </div>
            </div>

            <Separator />

            {/* Time Limit */}
            <div>
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium text-gray-700">
                  Time Limit
                </Label>
                <button
                  onClick={() => handleToggle("enableTimeLimit")}
                  className={`relative inline-flex h-6 w-11 items-center rounded transition-colors ${
                    formData.enableTimeLimit ? "bg-blue-600" : "bg-gray-300"
                  }`}
                  type="button"
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded bg-white transition-transform ${
                      formData.enableTimeLimit
                        ? "translate-x-6"
                        : "translate-x-1"
                    }`}
                  />
                </button>
              </div>
              {formData.enableTimeLimit && (
                <div className="mt-3">
                  <Input
                    type="number"
                    placeholder="Enter time limit in minutes"
                    value={formData.timeLimit || ""}
                    onChange={(e) =>
                      handleInputChange(
                        "timeLimit",
                        e.target.value ? parseInt(e.target.value) : null,
                      )
                    }
                    className="rounded w-64"
                  />
                </div>
              )}
            </div>
          </div>
        </Card>

        {/* Question Selector */}
        <Card className="rounded p-6 mb-6 bg-white">
          <div className="rounded flex items-center justify-between mb-6">
            <h2 className="rounded text-xl font-semibold text-gray-900">
              Questions
            </h2>
            <Button
              onClick={() => setShowQuestionBank(true)}
              className="rounded gap-2"
            >
              <Plus size={18} />
              Import from Bank
            </Button>
          </div>

          {selectedQuestions.length === 0 ? (
            <div className="rounded text-center py-8">
              <p className="rounded text-gray-500">
                No questions selected yet. Click "Import from Bank" to add
                questions.
              </p>
            </div>
          ) : (
            <DndContext
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={selectedQuestions.map((q) => q._id)}
                strategy={verticalListSortingStrategy}
              >
                <div className="rounded space-y-3">
                  {selectedQuestions.map((question) => (
                    <DraggableQuestionCard
                      key={question._id}
                      question={question}
                      onRemove={(questionToRemove: Question) => {
                        const filtered = selectedQuestions.filter(
                          (q) => q._id !== questionToRemove._id,
                        );
                        setSelectedQuestions(filtered);
                        setQuestions((prev) => [...prev, questionToRemove]);
                      }}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          )}

          <div className="rounded mt-4 text-sm text-gray-600">
            {selectedQuestions.length > 0 && (
              <p>
                {selectedQuestions.length} question
                {selectedQuestions.length !== 1 ? "s" : ""} selected
              </p>
            )}
          </div>
        </Card>

        {/* Quiz Logic & Behavior */}
        <Card className="rounded p-6 bg-white">
          <h2 className="rounded text-xl font-semibold text-gray-900 mb-6">
            Quiz Behavior
          </h2>

          <div className="rounded space-y-6">
            {/* Shuffle Toggle */}
            <div className=" flex items-center justify-between p-4 border rounded hover:bg-gray-50 transition">
              <div>
                <Label className="rounded font-medium text-gray-900">
                  Randomize question order
                </Label>
                <p className="rounded text-sm text-gray-600 mt-1">
                  Each student gets questions in a random order
                </p>
              </div>
              <button
                onClick={() => handleToggle("shuffle")}
                className={`relative inline-flex h-6 w-11 items-center rounded transition-colors ${
                  formData.shuffle ? "bg-blue-600" : "bg-gray-300"
                }`}
                type="button"
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded bg-white transition-transform ${
                    formData.shuffle ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>

            {/* Instant Feedback Toggle */}
            <div className="rounded flex items-center justify-between p-4 border hover:bg-gray-50 transition">
              <div>
                <Label className="rounded font-medium text-gray-900">
                  Instant feedback
                </Label>
                <p className="rounded text-sm text-gray-600 mt-1">
                  Show correct answer/explanation after a wrong guess
                </p>
              </div>
              <button
                onClick={() => handleToggle("instantFeedback")}
                className={`rounded relative inline-flex h-6 w-11 items-center transition-colors ${
                  formData.instantFeedback ? "bg-blue-600" : "bg-gray-300"
                }`}
                type="button"
              >
                <span
                  className={`rounded inline-block h-4 w-4 transform bg-white transition-transform ${
                    formData.instantFeedback ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>
          </div>
        </Card>

        {/* Action Buttons */}
        <div className="rounded flex gap-4 mt-8 justify-end">
          <Button variant="outline">Cancel</Button>
          <Button
            className="rounded gap-2"
            onClick={handleSubmit}
            disabled={selectedQuestions.length <= 0}
          >
            <Plus size={18} />
            Create Quiz
          </Button>
        </div>
      </div>

      {/* Question Bank Modal */}
      <Dialog open={showQuestionBank} onOpenChange={setShowQuestionBank}>
        <DialogContent className="rounded max-w-2xl max-h-96">
          <DialogHeader>
            <DialogTitle>Select Questions from Bank</DialogTitle>
          </DialogHeader>

          <div className="rounded space-y-3 overflow-y-auto max-h-80">
            {availableQuestions.map((question) => (
              <div
                key={question._id}
                className="rounded flex items-start justify-between p-4 border  hover:bg-gray-50 transition"
              >
                <div className="rounded flex-1">
                  <p className="rounded text-sm font-medium text-gray-900">
                    {question.question}
                  </p>
                  <div className="rounded flex items-center gap-2 mt-2">
                    {question.media && question.media.type === "image" && (
                      <span className="rounded inline-flex items-center gap-1 text-xs bg-blue-100 text-blue-700 px-2 py-1 ">
                        <Image size={14} /> Image
                      </span>
                    )}
                    {question.media && question.media.type === "video" && (
                      <span className="rounded inline-flex items-center gap-1 text-xs bg-purple-100 text-purple-700 px-2 py-1 ">
                        <Video size={14} /> Video
                      </span>
                    )}
                    {!question.media && (
                      <span className="rounded inline-flex items-center gap-1 text-xs bg-gray-100 text-gray-700 px-2 py-1 ">
                        No media
                      </span>
                    )}
                  </div>
                </div>
                <Button
                  size="sm"
                  onClick={() => {
                    setSelectedQuestions([...selectedQuestions, question]);
                    setQuestions((prev) =>
                      prev.filter((q) => q._id !== question._id),
                    );
                  }}
                  className="rounded shrink-0"
                >
                  <Plus size={16} />
                </Button>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default QuizCreator;
