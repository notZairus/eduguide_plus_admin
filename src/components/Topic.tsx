import { SquarePen } from "lucide-react";
import { Separator } from "./ui/separator";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
  DialogFooter,
} from "./ui/dialog";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Trash2 } from "lucide-react";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { useEffect, useState, type FormEvent } from "react";
import { api } from "../lib/api.js";
import { Textarea } from "./ui/textarea";
import SortableSection from "./SortableSection.js";
import { Input } from "./ui/input";
import { DndContext, type DragEndEvent } from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import Loader from "./Loader.js";

const Topic = ({
  topic,
  setActiveTopic,
  sections,
  setSections,
}: {
  topic: Topic;
  setActiveTopic: React.Dispatch<React.SetStateAction<Topic | null>>;
  sections: Section[];
  setSections: React.Dispatch<React.SetStateAction<Section[]>>;
}) => {
  const [availableQuizzes, setAvailableQuizzes] = useState<Quiz[] | null>(null);
  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(
    topic.active_quiz ?? null,
  );
  const [useQuizLoading, setUseQuizLoading] = useState(false);
  const [deleteQuizLoading, setDeleteQuizLoading] = useState(false);

  useEffect(() => {
    async function fetchQuizzes() {
      try {
        const res = await api.get(`/quizzes/topics/${topic._id}`);
        setAvailableQuizzes(res.data.quizzes || []);
      } catch (e) {
        console.log(e);
      }
    }

    fetchQuizzes();
  }, [topic]);

  async function handleEditTopicTitle(e: FormEvent) {
    e.preventDefault();

    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const { title } = Object.fromEntries(formData.entries());
    const res = await api.patch(`/topics/${topic._id}`, { title });
    setActiveTopic(res.data.topic);
  }

  async function handleCreateSection(e: FormEvent) {
    e.preventDefault();
    const form = e.currentTarget as HTMLFormElement;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    try {
      const res = await api.post("/sections", {
        topic_id: topic._id,
        title: data.title,
      });

      setSections([...sections, res.data.section]);
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

  async function handleDeleteSection(_id: string) {
    await api.delete(`/sections/${_id}`);
    const sectionFiltered = sections.filter((s) => s._id !== _id);
    setSections(sectionFiltered);
  }

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (active.id == over?.id) return;

    const activeIndex = sections.findIndex((s) => s._id === active.id);
    const overIndex = sections.findIndex((s) => s._id === over?.id);

    const newSectionOrder = arrayMove(sections, activeIndex, overIndex);

    newSectionOrder.forEach(async (section, index) => {
      await api.patch(`/sections/${section._id}`, {
        order: index + 1,
      });
    });

    setSections(newSectionOrder);
  }

  async function handleUseQuiz() {
    setUseQuizLoading(true);
    await api.patch(`/topics/${topic._id}`, {
      active_quiz: selectedQuiz?._id,
    });
    setUseQuizLoading(false);
  }

  async function handleDeleteQuiz() {
    setDeleteQuizLoading(true);
    await api.delete(`/quizzes/${selectedQuiz?._id}`);

    const filteredAvailableQuizzes: Quiz[] =
      availableQuizzes?.filter((q) => q._id !== selectedQuiz?._id) || [];

    setAvailableQuizzes(filteredAvailableQuizzes);
    setSelectedQuiz(null);
    setDeleteQuizLoading(false);
  }

  if (!availableQuizzes) return <p>Loading...</p>;

  return (
    <>
      <Loader show={useQuizLoading} text="Updating..." />
      <Loader show={deleteQuizLoading} text="Deleting..." />

      <section className="w-full h-full flex flex-col">
        <header>
          <div className="w-full flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <h1 className="text-3xl font-medium max-w-sm wrap-break-word">
                {topic.title}
              </h1>
              <Dialog>
                <DialogTrigger asChild>
                  <SquarePen
                    size={24}
                    className="text-nc-blue cursor-pointer"
                  />
                </DialogTrigger>
                <DialogContent className="sm:max-w-sm rounded">
                  <form onSubmit={handleEditTopicTitle} className="space-y-4">
                    <DialogHeader>
                      <DialogTitle>Edit Topic</DialogTitle>
                      <DialogDescription>
                        Update the topic title here. Click save when you&apos;re
                        done.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4">
                      <div className="grid gap-3">
                        <Label htmlFor="title">Topic Title</Label>
                        <Textarea
                          id="title"
                          name="title"
                          defaultValue={topic.title}
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <DialogClose asChild>
                        <Button variant="outline">Cancel</Button>
                      </DialogClose>
                      <DialogClose asChild>
                        <Button type="submit">Save Topic</Button>
                      </DialogClose>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            <div className="flex items-center gap-3">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="default" size="sm">
                    + Add Section
                  </Button>
                </DialogTrigger>

                <DialogContent className="sm:max-w-sm rounded">
                  <form onSubmit={handleCreateSection} className="space-y-4">
                    <DialogHeader>
                      <DialogTitle>Create Section</DialogTitle>
                      <DialogDescription>
                        Enter the Section title here. Click save when
                        you&apos;re done.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4">
                      <div className="grid gap-3">
                        <Label htmlFor="title">Section Title</Label>
                        <Input id="title" name="title" />
                      </div>
                    </div>
                    <DialogFooter>
                      <DialogClose asChild>
                        <Button variant="outline">Cancel</Button>
                      </DialogClose>
                      <DialogClose asChild>
                        <Button type="submit">Create Section</Button>
                      </DialogClose>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          <Separator className="mt-4" />

          <div className="w-full h-20 bg-background mt-4 flex gap-8">
            <div className="space-y-2 flex-1">
              <Label>Quiz</Label>
              <div className="flex items-center gap-4">
                <Select
                  value={selectedQuiz?._id}
                  onValueChange={(value) => {
                    const selected = availableQuizzes.find(
                      (q) => q._id === value,
                    );
                    setSelectedQuiz(selected as Quiz);
                  }}
                >
                  <SelectTrigger className="w-full rounded">
                    <SelectValue
                      placeholder={
                        availableQuizzes.length > 0
                          ? "Select a Quiz to link"
                          : "No available quiz to link"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Available Quizzes</SelectLabel>
                      {(availableQuizzes as []).map(
                        (quiz: { _id: string; title: string }) => (
                          <SelectItem value={quiz._id} key={quiz._id}>
                            {quiz.title}
                          </SelectItem>
                        ),
                      )}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <Button disabled={!selectedQuiz} onClick={handleUseQuiz}>
                  Use Quiz
                </Button>

                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant={"destructive"} disabled={!selectedQuiz}>
                      <Trash2 />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-sm rounded">
                    <DialogHeader>
                      <DialogTitle>Delete Quiz</DialogTitle>
                      <DialogDescription>
                        Are you sure you want to delete this quiz? This action
                        cannot be undone. You may lose all the student records
                        associated with this quiz.
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                      <DialogClose asChild>
                        <Button variant="outline">Cancel</Button>
                      </DialogClose>
                      <DialogClose asChild>
                        <Button
                          variant={"destructive"}
                          onClick={() => handleDeleteQuiz()}
                        >
                          Delete Quiz
                        </Button>
                      </DialogClose>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </div>
        </header>

        <Separator className="mt-3" />

        <main className="flex-1 overflow-y-auto mt-4">
          {sections.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No sections yet. Click "Add Section" to get started.
            </div>
          ) : (
            <DndContext onDragEnd={handleDragEnd}>
              <SortableContext
                items={sections.map((s) => s._id)}
                strategy={verticalListSortingStrategy}
              >
                <div className="space-y-4">
                  {sections.map((section) => (
                    <SortableSection
                      key={section._id}
                      section={section}
                      handleDeleteSection={handleDeleteSection}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          )}
        </main>
      </section>
    </>
  );
};

export default Topic;
