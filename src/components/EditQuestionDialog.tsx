import { useState, useRef, type FormEvent } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogHeader,
} from "./ui/dialog";
import { ScrollArea } from "./ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Card, CardContent, CardTitle } from "../components/ui/card";
import { Label } from "@radix-ui/react-label";
import { Textarea } from "./ui/textarea";
import { Input } from "./ui/input";
import Loader from "./Loader";
import { Upload } from "lucide-react";
import { Button } from "./ui/button";
import ReactPlayer from "react-player";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { api } from "../lib/api";

const EditQuestionDialog = ({
  question,
  topics,
  setQuestions,
}: {
  question: Question;
  topics: Topic[];
  setQuestions: React.Dispatch<React.SetStateAction<Question[]>>;
}) => {
  const [data, setData] = useState({
    topic: question.topic_id,
    section: question.section_id,
    questionType: question.type,
    answer: question.answer,
    question: question.question,
    explanation: question.explanation ?? "",
  });

  const [media, setMedia] = useState<
    | {
        type: "image" | "video";
        file: File;
      }
    | null
    | string
  >(question.media ? question.media.url : null);

  const [choices, setChoices] = useState(
    question.type === "multiple-choice"
      ? (question.choices as string[])
      : Array.from({ length: 4 }),
  );

  const [isUpdating, setIsUpdating] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setIsUpdating(true);

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

    if (media && typeof media !== "string") {
      formData.append("file", media.file);
    }

    try {
      const res = await api.put(`/questions/${question._id}`, formData);
      const updatedQuestion = res.data.question;

      setQuestions((prev) => {
        const copy = prev.slice();
        const index = copy.findIndex((q) => q._id === question._id);
        copy[index] = updatedQuestion;
        return copy;
      });
      setIsUpdating(false);
    } catch (error) {
      console.error("Error updating question:", error);
      setIsUpdating(false);
    }
  }

  return (
    <>
      <Loader show={isUpdating} text="Updating..." />

      <Dialog>
        <DialogTrigger className="text-blue-500" asChild>
          <p className="pl-2 text-sm cursor-pointer">Edit</p>
        </DialogTrigger>
        <DialogContent className="rounded min-w-2xl flex flex-col">
          <DialogHeader>
            <DialogTitle>Edit Question</DialogTitle>
            <DialogDescription>Update the question details</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
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
                          value={question.topic_id}
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
                          value={data.section}
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

                {/* QUESTION */}
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

                    {media && (
                      <div className="rounded overflow-hidden relative p-2 bg-gray-50 border">
                        <Button
                          className="absolute top-2 right-2"
                          onClick={() => setMedia(null)}
                        >
                          x
                        </Button>
                        {typeof media === "string" &&
                          question.media &&
                          question?.media?.type === "image" && (
                            <img src={media} alt="image" />
                          )}

                        {typeof media === "string" &&
                          question.media &&
                          question?.media?.type === "video" && (
                            <ReactPlayer src={media} controls width={"80%"} />
                          )}

                        {typeof media !== "string" &&
                          media.type === "image" && (
                            <img
                              src={URL.createObjectURL(media.file)}
                              alt="uploaded image"
                            />
                          )}

                        {typeof media !== "string" &&
                          media.type === "video" && (
                            <ReactPlayer
                              src={URL.createObjectURL(media.file as File)}
                              controls
                              width={"80%"}
                            />
                          )}
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* CONTENT */}
                <Card className="mb-6 rounded p-4">
                  <CardTitle>Choices</CardTitle>

                  {/* MULTIPLE CHOICE */}
                  {data.questionType === "multiple-choice" && (
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
                  )}

                  {/* IDENTIFICATION */}
                  {data.questionType === "identification" && (
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
                  )}

                  {/* TRUE OR FALSE */}
                  {data.questionType === "true-or-false" && (
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
                  )}
                </Card>

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
                Update Question
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default EditQuestionDialog;
