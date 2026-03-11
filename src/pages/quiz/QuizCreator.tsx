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
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";

import {
  Settings,
  Plus,
  X,
  GripVertical,
  ImageIcon,
  Video,
  ChevronDown,
  ClipboardList,
  Settings2,
  BookOpen,
  Timer,
  Shuffle,
  MessageSquareMore,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
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

const questionTypeConfig: Record<
  Question["type"],
  { label: string; color: string }
> = {
  "multiple-choice": {
    label: "Multiple Choice",
    color: "bg-violet-100 text-violet-700",
  },
  identification: {
    label: "Identification",
    color: "bg-amber-100 text-amber-700",
  },
  "true-or-false": {
    label: "True or False",
    color: "bg-teal-100 text-teal-700",
  },
};

function Toggle({
  enabled,
  onToggle,
}: {
  enabled: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      onClick={onToggle}
      type="button"
      role="switch"
      aria-checked={enabled}
      className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors focus-visible:outline-none ${
        enabled ? "bg-blue-600" : "bg-gray-200"
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform ${
          enabled ? "translate-x-6" : "translate-x-1"
        }`}
      />
    </button>
  );
}

function SectionHeader({
  icon,
  title,
  subtitle,
  step,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  step: number;
}) {
  return (
    <div className="flex items-start gap-3 mb-6">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-600 text-white text-sm font-semibold">
        {step}
      </div>
      <div>
        <div className="flex items-center gap-2">
          {icon}
          <h2 className="text-base font-semibold text-gray-900">{title}</h2>
        </div>
        {subtitle && <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>}
      </div>
    </div>
  );
}

function DraggableQuestionCard({
  question,
  index,
  onRemove,
}: {
  question: Question;
  index: number;
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
    opacity: isDragging ? 0.4 : 1,
    zIndex: isDragging ? 10 : undefined,
  };

  const typeConf = questionTypeConfig[question.type] ?? {
    label: question.type,
    color: "bg-gray-100 text-gray-700",
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="group bg-white border border-gray-200 rounded-lg p-4 flex items-start gap-3 hover:border-blue-300 hover:shadow-sm transition-all"
    >
      <button
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing text-gray-300 hover:text-gray-500 shrink-0 mt-0.5"
        type="button"
        title="Drag to reorder"
      >
        <GripVertical size={18} />
      </button>

      <span className="shrink-0 flex h-6 w-6 items-center justify-center rounded-full bg-gray-100 text-xs font-medium text-gray-600 mt-0.5">
        {index + 1}
      </span>

      <div className="flex-1 min-w-0">
        <p className="text-sm text-gray-800 font-medium line-clamp-2 leading-snug">
          {question.question}
        </p>
        <div className="flex flex-wrap items-center gap-2 mt-2">
          <span
            className={`inline-flex items-center text-xs font-medium px-2 py-0.5 rounded-full ${typeConf.color}`}
          >
            {typeConf.label}
          </span>
          {question.media?.type === "image" && (
            <span className="inline-flex items-center gap-1 text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full font-medium">
              <ImageIcon size={11} /> Image
            </span>
          )}
          {question.media?.type === "video" && (
            <span className="inline-flex items-center gap-1 text-xs bg-purple-50 text-purple-600 px-2 py-0.5 rounded-full font-medium">
              <Video size={11} /> Video
            </span>
          )}
        </div>
      </div>

      <button
        onClick={() => onRemove(question)}
        className="shrink-0 text-gray-300 hover:text-red-500 transition-colors mt-0.5"
        type="button"
        title="Remove question"
      >
        <X size={16} />
      </button>
    </div>
  );
}

const initialFormData: QuizFormData = {
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
  const [bankSearch, setBankSearch] = useState("");
  const [topics, setTopics] = useState<Topic[]>([]);
  const [selectedQuestions, setSelectedQuestions] = useState<Question[]>([]);
  const [showQuestionBank, setShowQuestionBank] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);

  const availableQuestions = questions.filter(
    (q) => q.topic_id === formData.linkedTopic,
  );

  const filteredBankQuestions = bankSearch.trim()
    ? availableQuestions.filter((q) =>
        q.question.toLowerCase().includes(bankSearch.toLowerCase()),
      )
    : availableQuestions;

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

  const handleInputChange = (field: keyof QuizFormData, value: unknown) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleToggle = (
    field: "enableTimeLimit" | "shuffle" | "instantFeedback",
  ) => {
    setFormData((prev) => ({ ...prev, [field]: !prev[field] }));
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

  const isValid =
    formData.title.trim() !== "" &&
    formData.linkedTopic !== "" &&
    selectedQuestions.length > 0;

  const passingScoreColor =
    formData.passingScore >= 75
      ? "text-green-600"
      : formData.passingScore >= 50
        ? "text-amber-600"
        : "text-red-500";

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-50">
              <ClipboardList className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-2xl font-semibold tracking-tight">
                Create New Quiz
              </h2>
              <p className="text-sm text-muted-foreground">
                Build and configure a new quiz.
              </p>
            </div>
          </div>
        </div>

        <Separator />

        {/* ── Step 1: Quiz Identity ── */}
        <Card className="p-6 mb-5 bg-white shadow-sm border border-gray-200">
          <SectionHeader
            step={1}
            icon={<BookOpen size={15} className="text-gray-500" />}
            title="Quiz Identity"
            subtitle="Basic information about this quiz"
          />

          <div className="space-y-5">
            <div>
              <Label
                htmlFor="quiz-title"
                className="text-sm font-medium text-gray-700 mb-1.5 block"
              >
                Quiz Title <span className="text-red-400">*</span>
              </Label>
              <Input
                id="quiz-title"
                placeholder="e.g., Admission Policy Mastery"
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                className="w-full"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <Label className="text-sm font-medium text-gray-700 mb-1.5 block">
                  Linked Topic <span className="text-red-400">*</span>
                </Label>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-between font-normal text-gray-700"
                    >
                      <span className="truncate">
                        {formData.linkedTopic
                          ? (topics.find((t) => t._id === formData.linkedTopic)
                              ?.title ?? "Select a topic")
                          : "Select a topic"}
                      </span>
                      <ChevronDown
                        size={14}
                        className="text-gray-400 shrink-0"
                      />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-(--radix-dropdown-menu-trigger-width) max-h-52 overflow-y-auto">
                    {topics.map((topic) => (
                      <DropdownMenuItem
                        key={topic._id}
                        onClick={() =>
                          handleInputChange("linkedTopic", topic._id)
                        }
                        className={
                          formData.linkedTopic === topic._id
                            ? "bg-blue-50 text-blue-700"
                            : ""
                        }
                      >
                        {topic.title}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div>
                <Label
                  htmlFor="passing-score"
                  className="text-sm font-medium text-gray-700 mb-1.5 block"
                >
                  Passing Score
                </Label>
                <div className="flex items-center gap-3">
                  <div className="relative w-20">
                    <Input
                      id="passing-score"
                      type="number"
                      min="0"
                      max="100"
                      value={formData.passingScore}
                      onChange={(e) =>
                        handleInputChange(
                          "passingScore",
                          Math.min(
                            100,
                            Math.max(0, parseInt(e.target.value) || 0),
                          ),
                        )
                      }
                      className="pr-6 text-center"
                    />
                    <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-gray-400 pointer-events-none">
                      %
                    </span>
                  </div>
                  <div className="flex-1">
                    <input
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
                      className="w-full accent-blue-600 cursor-pointer"
                    />
                  </div>
                  <span
                    className={`text-sm font-semibold w-10 text-right ${passingScoreColor}`}
                  >
                    {formData.passingScore}%
                  </span>
                </div>
              </div>
            </div>

            <Separator />

            <div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Timer size={15} className="text-gray-400" />
                  <div>
                    <Label className="text-sm font-medium text-gray-700">
                      Time Limit
                    </Label>
                    <p className="text-xs text-gray-400">
                      Set a maximum duration for this quiz
                    </p>
                  </div>
                </div>
                <Toggle
                  enabled={formData.enableTimeLimit}
                  onToggle={() => handleToggle("enableTimeLimit")}
                />
              </div>
              {formData.enableTimeLimit && (
                <div className="mt-3 flex items-center gap-2">
                  <Input
                    type="number"
                    min="1"
                    placeholder="e.g., 30"
                    value={formData.timeLimit ?? ""}
                    onChange={(e) =>
                      handleInputChange(
                        "timeLimit",
                        e.target.value ? parseInt(e.target.value) : null,
                      )
                    }
                    className="w-32"
                  />
                  <span className="text-sm text-gray-500">minutes</span>
                </div>
              )}
            </div>
          </div>
        </Card>

        {/* ── Step 2: Questions ── */}
        <Card className="p-6 mb-5 bg-white shadow-sm border border-gray-200">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-start gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-600 text-white text-sm font-semibold">
                2
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <ClipboardList size={15} className="text-gray-500" />
                  <h2 className="text-base font-semibold text-gray-900">
                    Questions
                  </h2>
                  {selectedQuestions.length > 0 && (
                    <span className="inline-flex items-center justify-center h-5 min-w-5 px-1.5 rounded-full bg-blue-600 text-white text-xs font-semibold">
                      {selectedQuestions.length}
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-0.5">
                  Drag to reorder questions
                </p>
              </div>
            </div>
            <Button
              onClick={() => setShowQuestionBank(true)}
              size="sm"
              className="gap-1.5 shrink-0"
              disabled={!formData.linkedTopic}
              title={!formData.linkedTopic ? "Select a topic first" : undefined}
            >
              <Plus size={14} />
              Add Questions
            </Button>
          </div>

          {selectedQuestions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center border-2 border-dashed border-gray-200 rounded-lg bg-gray-50/50">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 mb-3">
                <ClipboardList size={22} className="text-gray-400" />
              </div>
              <p className="text-sm font-medium text-gray-600">
                No questions added yet
              </p>
              <p className="text-xs text-gray-400 mt-1">
                {!formData.linkedTopic
                  ? "Select a topic above, then click Add Questions"
                  : "Click Add Questions to import from your bank"}
              </p>
            </div>
          ) : (
            <>
              <DndContext
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={selectedQuestions.map((q) => q._id)}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="space-y-2">
                    {selectedQuestions.map((question, i) => (
                      <DraggableQuestionCard
                        key={question._id}
                        question={question}
                        index={i}
                        onRemove={(q) => {
                          setSelectedQuestions((prev) =>
                            prev.filter((x) => x._id !== q._id),
                          );
                          setQuestions((prev) => [...prev, q]);
                        }}
                      />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
              <p className="mt-3 text-xs text-gray-400 text-right">
                {selectedQuestions.length} question
                {selectedQuestions.length !== 1 ? "s" : ""} selected
              </p>
            </>
          )}
        </Card>

        {/* ── Step 3: Quiz Behavior ── */}
        <Card className="p-6 mb-8 bg-white shadow-sm border border-gray-200">
          <SectionHeader
            step={3}
            icon={<Settings2 size={15} className="text-gray-500" />}
            title="Quiz Behavior"
            subtitle="Configure how students experience this quiz"
          />
          <div className="divide-y divide-gray-100">
            <div className="flex items-center justify-between py-4 first:pt-0">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-md bg-violet-50">
                  <Shuffle size={15} className="text-violet-600" />
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-800 cursor-default">
                    Randomize question order
                  </Label>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Each student sees questions in a different order
                  </p>
                </div>
              </div>
              <Toggle
                enabled={formData.shuffle}
                onToggle={() => handleToggle("shuffle")}
              />
            </div>
            <div className="flex items-center justify-between py-4 last:pb-0">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-md bg-green-50">
                  <MessageSquareMore size={15} className="text-green-600" />
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-800 cursor-default">
                    Instant feedback
                  </Label>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Show the correct answer and explanation after each wrong
                    guess
                  </p>
                </div>
              </div>
              <Toggle
                enabled={formData.instantFeedback}
                onToggle={() => handleToggle("instantFeedback")}
              />
            </div>
          </div>
        </Card>

        {/* Action Buttons */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs text-gray-400">
            {isValid ? (
              <>
                <CheckCircle2 size={14} className="text-green-500" />
                <span>Ready to create</span>
              </>
            ) : (
              <>
                <AlertCircle size={14} className="text-amber-400" />
                <span>Fill in all required fields to continue</span>
              </>
            )}
          </div>
          <div className="flex gap-3">
            <Button variant="outline" type="button">
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!isValid}
              className="gap-2"
            >
              <Plus size={16} />
              Create Quiz
            </Button>
          </div>
        </div>
      </div>

      {/* ── Question Bank Modal ── */}
      <Dialog
        open={showQuestionBank}
        onOpenChange={(open) => {
          setShowQuestionBank(open);
          if (!open) setBankSearch("");
        }}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ClipboardList size={18} />
              Question Bank
            </DialogTitle>
            <DialogDescription>
              {availableQuestions.length} question
              {availableQuestions.length !== 1 ? "s" : ""} available for{" "}
              <span className="font-medium text-gray-700">
                {topics.find((t) => t._id === formData.linkedTopic)?.title}
              </span>
            </DialogDescription>
          </DialogHeader>

          <div className="mt-1">
            <Input
              placeholder="Search questions..."
              value={bankSearch}
              onChange={(e) => setBankSearch(e.target.value)}
              className="w-full"
            />
          </div>

          <div className="space-y-2 overflow-y-auto max-h-72 pr-1 mt-1">
            {filteredBankQuestions.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <ClipboardList size={28} className="text-gray-300 mb-2" />
                <p className="text-sm text-gray-500">
                  {bankSearch
                    ? "No questions match your search."
                    : "No questions available for this topic."}
                </p>
              </div>
            ) : (
              filteredBankQuestions.map((question) => {
                const typeConf = questionTypeConfig[question.type] ?? {
                  label: question.type,
                  color: "bg-gray-100 text-gray-700",
                };
                return (
                  <div
                    key={question._id}
                    className="flex items-start gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-800 font-medium leading-snug line-clamp-2">
                        {question.question}
                      </p>
                      <div className="flex flex-wrap items-center gap-1.5 mt-2">
                        <span
                          className={`inline-flex items-center text-xs font-medium px-2 py-0.5 rounded-full ${typeConf.color}`}
                        >
                          {typeConf.label}
                        </span>
                        {question.media?.type === "image" && (
                          <span className="inline-flex items-center gap-1 text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">
                            <ImageIcon size={10} /> Image
                          </span>
                        )}
                        {question.media?.type === "video" && (
                          <span className="inline-flex items-center gap-1 text-xs bg-purple-50 text-purple-600 px-2 py-0.5 rounded-full">
                            <Video size={10} /> Video
                          </span>
                        )}
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setSelectedQuestions((prev) => [...prev, question]);
                        setQuestions((prev) =>
                          prev.filter((q) => q._id !== question._id),
                        );
                      }}
                      className="shrink-0 gap-1"
                    >
                      <Plus size={13} />
                      Add
                    </Button>
                  </div>
                );
              })
            )}
          </div>

          {selectedQuestions.length > 0 && (
            <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
              <span>
                {selectedQuestions.length} question
                {selectedQuestions.length !== 1 ? "s" : ""} added to quiz
              </span>
              <Button
                size="sm"
                onClick={() => {
                  setShowQuestionBank(false);
                  setBankSearch("");
                }}
              >
                Done
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default QuizCreator;
