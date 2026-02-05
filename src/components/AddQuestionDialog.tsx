import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogHeader,
} from "./ui/dialog";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Textarea } from "./ui/textarea";
import { RadioGroup, RadioGroupItem } from "../components/ui/radio-group";
import { Card, CardContent, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Plus, Upload } from "lucide-react";
import { ScrollArea } from "./ui/scroll-area";
import { Label } from "@radix-ui/react-label";
import { useRef, useState, type FormEvent } from "react";
import { api } from "../lib/api";

const initialData = {
  topic: "",
  section: "",
  questionType: "multiple-choice",
  question: "",
  answer: "",
  explanation: "",
};

const AddQuestionDialog = ({ topics }: { topics: Topic[] }) => {
  const [data, setData] = useState(initialData);
  const [choices, setChoices] = useState(Array.from({ length: 4 }));
  const [media, setMedia] = useState<{
    file: File;
    type: "image" | "video";
  } | null>(null);
  const fileInputRef = useRef(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const formData = new FormData();
    formData.append("topicId", data.topic);
    formData.append("sectionId", data.section);
    formData.append("type", data.questionType);
    formData.append("question", data.question);
    formData.append("answer", data.answer);
    formData.append("explanation", data.explanation);

    if (data.questionType === "multiple-choice") {
      formData.append("choices", JSON.stringify(choices));
    }

    if (media) {
      formData.append("file", media.file);
    }

    try {
      const res = await api.post("/questions", formData);
      console.log(res);
      setMedia(null);
      setData({
        ...data,
        question: "",
        answer: "",
        explanation: "",
      });
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <Button>
            <Plus size={16} />
            Add Question
          </Button>
        </DialogTrigger>
        <DialogContent className="rounded min-w-2xl flex flex-col">
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle>Add Question</DialogTitle>
              <DialogDescription>
                Create a new question to add to your question bank
              </DialogDescription>
            </DialogHeader>
            <div className="flex-1">
              <ScrollArea className="w-full h-90 p-1">
                {/* SETUP */}
                <Card className="rounded p-4 mb-6">
                  <CardTitle>Setup</CardTitle>
                  <CardContent className="px-6 space-y-4">
                    <div className="w-full grid grid-cols-2 gap-x-8 gap-y-4">
                      <div>
                        <Label htmlFor="topic">Topic *</Label>
                        <Select
                          required
                          value={data.topic}
                          onValueChange={(value) => {
                            setData({ ...data, topic: value, section: "" });
                          }}
                          name="topic"
                        >
                          <SelectTrigger className="rounded w-full">
                            <SelectValue placeholder="Referenced Topic" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              {topics.map((topic) => (
                                <SelectItem key={topic._id} value={topic._id}>
                                  {topic.title}
                                </SelectItem>
                              ))}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="section">Section *</Label>
                        <Select
                          required
                          name="section"
                          disabled={data.topic ? false : true}
                          onValueChange={(value) => {
                            setData({ ...data, section: value });
                          }}
                        >
                          <SelectTrigger className="rounded w-full">
                            <SelectValue placeholder="Referenced Topic" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              {topics
                                .find((t) => t._id === data.topic)
                                ?.sections.map((section) => (
                                  <SelectItem value={section._id}>
                                    {section.title}
                                  </SelectItem>
                                ))}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="type">Question Type *</Label>
                        <Select
                          required
                          name="type"
                          value={data.questionType}
                          onValueChange={(value) => {
                            setData({
                              ...data,
                              questionType: value,
                              answer: "",
                            });
                            setChoices(Array.from({ length: 4 }));
                          }}
                        >
                          <SelectTrigger className="rounded w-full">
                            <SelectValue placeholder="Question Type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectItem value={"multiple-choice"}>
                                Multiple Choice
                              </SelectItem>
                              <SelectItem value={"identification"}>
                                Identification
                              </SelectItem>
                              <SelectItem value={"true-or-false"}>
                                True or False
                              </SelectItem>
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* CONTENT */}
                <Card className="rounded p-4 mb-6">
                  <CardTitle>Content</CardTitle>
                  <CardContent className="px-6 space-y-4">
                    <Textarea
                      required
                      value={data.question}
                      onChange={(e) => {
                        setData({ ...data, question: e.target.value });
                      }}
                      placeholder="Enter the question here..."
                    />

                    {!media && (
                      <div
                        className="border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center text-sm text-muted-foreground"
                        onClick={() => {
                          const fileInput = fileInputRef.current;
                          if (!fileInput) return;
                          (fileInput as { click: () => void }).click();
                        }}
                      >
                        <Input
                          type="file"
                          ref={fileInputRef}
                          hidden
                          accept="image/*,video/*"
                          onChange={(e) => {
                            if (!e.currentTarget.files) return;
                            const file = e?.currentTarget?.files[0] as File;

                            setMedia({
                              type: file.type.startsWith("image")
                                ? "image"
                                : "video",
                              file,
                            });
                          }}
                        />
                        <Upload className="mb-2" />
                        Drag and drop your image or video here or click to
                        select
                      </div>
                    )}

                    {media && media.type === "image" && (
                      <div className="rounded overflow-hidden relative p-2 bg-gray-50 border">
                        <Button
                          className="absolute top-2 right-2"
                          onClick={() => setMedia(null)}
                        >
                          x
                        </Button>
                        <img
                          src={URL.createObjectURL(media.file as File)}
                          alt="image"
                        />
                      </div>
                    )}

                    {media && media.type === "video" && (
                      <div className="bg-gray-50 border p-4 flex items-center justify-between rounded">
                        <p>{media?.file.name}</p>
                        <Button onClick={() => setMedia(null)}>x</Button>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* MULTIPLE CHOICE */}
                {data.questionType === "multiple-choice" && (
                  <Card className="mb-6 rounded p-4">
                    <CardTitle>Choices</CardTitle>
                    <CardContent className="px-6 space-y-4">
                      <RadioGroup
                        required
                        value={data.answer}
                        className="space-y-2"
                        onValueChange={(value) => {
                          setData({ ...data, answer: value });
                        }}
                      >
                        {choices.map((choice, i) => (
                          <div key={i} className="flex items-center gap-2">
                            <RadioGroupItem value={choice as string} />
                            <Input
                              required
                              placeholder={`Option ${i + 1}`}
                              value={choice as string}
                              onChange={(e) => {
                                const choicesCopy = choices.slice();
                                choicesCopy[i] = e.target.value;
                                setChoices(choicesCopy);
                              }}
                            />
                          </div>
                        ))}
                      </RadioGroup>
                    </CardContent>
                  </Card>
                )}

                {/* TRUE OR FALSE */}
                {data.questionType === "true-or-false" && (
                  <Card className="mb-6 rounded p-4">
                    <CardTitle>Answer</CardTitle>
                    <CardContent className="px-6 space-y-4">
                      <RadioGroup
                        required
                        className="space-y-2"
                        value={data.answer}
                        onValueChange={(value) => {
                          setData({ ...data, answer: value });
                        }}
                      >
                        <Label>
                          <RadioGroupItem value={`true`} /> True
                        </Label>
                        <Label>
                          <RadioGroupItem value={`false`} /> False
                        </Label>
                      </RadioGroup>
                    </CardContent>
                  </Card>
                )}

                {/* IDENTIFICATION */}
                {data.questionType === "identification" && (
                  <Card className="mb-6 rounded p-4">
                    <CardTitle>Answer</CardTitle>
                    <CardContent className="px-6 space-y-4">
                      <Input
                        required
                        type="text"
                        value={data.answer}
                        onChange={(e) =>
                          setData({ ...data, answer: e.target.value })
                        }
                        placeholder="Type the answer here."
                      />
                    </CardContent>
                  </Card>
                )}

                <Card className="rounded p-4 mb-6">
                  <CardTitle>Learning</CardTitle>
                  <CardContent className="px-6 space-y-4">
                    <Textarea
                      value={data.explanation}
                      placeholder="Explanation / Rationale (Why is this the answer?)"
                      onChange={(e) => {
                        setData({
                          ...data,
                          explanation: e.target.value,
                        });
                      }}
                    />
                    <p className="text-xs text-muted-foreground">
                      This explanation will appear on the mobile app after a
                      student answers.
                    </p>
                  </CardContent>
                </Card>
              </ScrollArea>
            </div>
            <div className="flex justify-end">
              <Button disabled={!data.answer || !data.question}>
                Create Question
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AddQuestionDialog;
