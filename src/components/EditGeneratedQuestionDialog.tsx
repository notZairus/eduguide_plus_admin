import { useState, type FormEvent } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { ScrollArea } from "./ui/scroll-area";
import { Card, CardContent, CardTitle } from "./ui/card";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Label } from "@radix-ui/react-label";
import { Textarea } from "./ui/textarea";
import { Input } from "./ui/input";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";

type QuestionType = "multiple-choice" | "identification" | "true-or-false";

const EditGeneratedQuestionDialog = ({
  question,
  topics,
  setGeneratedQuestions,
}: {
  question: Question;
  topics: Topic[];
  setGeneratedQuestions: React.Dispatch<React.SetStateAction<Question[]>>;
}) => {
  const [data, setData] = useState({
    topic: question.topic_id,
    section: question.section_id,
    questionType: question.type as QuestionType,
    answer: question.answer,
    question: question.question,
    explanation: question.explanation ?? "",
  });

  const [choices, setChoices] = useState<string[]>(
    question.type === "multiple-choice"
      ? (question.choices as string[])
      : Array.from({ length: 4 }, () => ""),
  );

  const [isOpen, setIsOpen] = useState(false);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();

    const updatedQuestion: Question = {
      ...question,
      topic_id: data.topic,
      section_id: data.section,
      type: data.questionType,
      question: data.question,
      answer: data.answer,
      explanation: data.explanation,
      choices: data.questionType === "multiple-choice" ? choices : [],
      updatedAt: new Date().toISOString(),
    };

    setGeneratedQuestions((prev) =>
      prev.map((item) => (item._id === question._id ? updatedQuestion : item)),
    );

    setIsOpen(false);
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button type="button" variant="outline" size="sm">
          Edit
        </Button>
      </DialogTrigger>

      <DialogContent className="rounded min-w-2xl flex flex-col">
        <DialogHeader>
          <DialogTitle>Edit Generated Question</DialogTitle>
          <DialogDescription>
            Update this generated question before saving it to the question
            bank.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="flex-1">
            <ScrollArea className="w-full h-90 p-1">
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
                        value={data.section}
                        disabled={!data.topic}
                        onValueChange={(value) => {
                          setData({ ...data, section: value });
                        }}
                      >
                        <SelectTrigger className="rounded w-full">
                          <SelectValue placeholder="Referenced Section" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            {topics
                              .find((t) => t._id === data.topic)
                              ?.sections.map((section) => (
                                <SelectItem
                                  key={section._id}
                                  value={section._id}
                                >
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
                            questionType: value as QuestionType,
                            answer: "",
                          });
                          setChoices(Array.from({ length: 4 }, () => ""));
                        }}
                      >
                        <SelectTrigger className="rounded w-full">
                          <SelectValue placeholder="Question Type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectItem value="multiple-choice">
                              Multiple Choice
                            </SelectItem>
                            <SelectItem value="identification">
                              Identification
                            </SelectItem>
                            <SelectItem value="true-or-false">
                              True or False
                            </SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>

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
                </CardContent>
              </Card>

              <Card className="mb-6 rounded p-4">
                <CardTitle>Choices</CardTitle>

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
                          <RadioGroupItem value={choice} />
                          <Input
                            required
                            placeholder={`Option ${i + 1}`}
                            value={choice}
                            onChange={(e) => {
                              const nextChoices = choices.slice();
                              nextChoices[i] = e.target.value;
                              setChoices(nextChoices);
                            }}
                          />
                        </div>
                      ))}
                    </RadioGroup>
                  </CardContent>
                )}

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
                        <RadioGroupItem value="true" /> True
                      </Label>
                      <Label>
                        <RadioGroupItem value="false" /> False
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
                </CardContent>
              </Card>
            </ScrollArea>
          </div>

          <div className="flex justify-end">
            <Button type="submit" disabled={!data.answer || !data.question}>
              Update Generated Question
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditGeneratedQuestionDialog;
