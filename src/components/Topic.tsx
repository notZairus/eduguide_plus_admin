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
import { DndContext, type DragEndEvent } from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import Loader from "./Loader.js";
import AddSectionDialog from "./AddSectionDialog.js";
import { useHandbookContext } from "../contexts/HandbookContext.js";

const Topic = () => {
  const { activeTopic, setActiveTopic } = useHandbookContext();
  const [availableQuizzes, setAvailableQuizzes] = useState<Quiz[] | null>(null);
  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(
    activeTopic?.active_quiz ?? null,
  );
  const [useQuizLoading, setUseQuizLoading] = useState(false);
  const [deleteQuizLoading, setDeleteQuizLoading] = useState(false);
  const [deleteSectionLoading, setDeleteSectionLoading] = useState(false);
  const [isUseQuizSuccessOpen, setIsUseQuizSuccessOpen] = useState(false);
  const [lastUsedQuizTitle, setLastUsedQuizTitle] = useState("");
  const [isDeleteQuizSuccessOpen, setIsDeleteQuizSuccessOpen] = useState(false);
  const [lastDeletedQuizTitle, setLastDeletedQuizTitle] = useState("");
  const [isDeleteSectionSuccessOpen, setIsDeleteSectionSuccessOpen] =
    useState(false);
  const [lastDeletedSectionTitle, setLastDeletedSectionTitle] = useState("");

  useEffect(() => {
    setSelectedQuiz(activeTopic?.active_quiz ?? null);
  }, [activeTopic]);

  useEffect(() => {
    async function fetchAvailableQuizzes() {
      try {
        const res = await api.get(`/quizzes/topics/${activeTopic?._id}`);
        setAvailableQuizzes(res.data.quizzes);
      } catch (e) {
        console.log(e);
        throw e;
      }
    }

    fetchAvailableQuizzes();
  }, [activeTopic]);

  async function handleEditTopicTitle(e: FormEvent) {
    e.preventDefault();

    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const { title } = Object.fromEntries(formData.entries());
    await api.patch(`/topics/${activeTopic?._id}`, { title });
    setActiveTopic({
      ...activeTopic,
      title: title as string,
    } as Topic);
  }

  async function handleDeleteSection(_id: string) {
    const sectionToDelete = activeTopic?.sections.find((s) => s._id === _id);

    try {
      setDeleteSectionLoading(true);
      await api.delete(`/sections/${_id}`);

      const sectionFiltered = activeTopic?.sections.filter(
        (s) => s._id !== _id,
      );
      const activeTopicCopy = {
        ...activeTopic,
        sections: sectionFiltered,
      };

      setActiveTopic(activeTopicCopy as Topic);
      setLastDeletedSectionTitle(sectionToDelete?.title || "Section");
      setIsDeleteSectionSuccessOpen(true);
    } finally {
      setDeleteSectionLoading(false);
    }
  }

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (active.id == over?.id) return;

    const activeIndex = activeTopic?.sections.findIndex(
      (s) => s._id === active.id,
    );
    const overIndex = activeTopic?.sections.findIndex(
      (s) => s._id === over?.id,
    );

    const newSectionOrder = arrayMove(
      activeTopic?.sections || [],
      activeIndex as number,
      overIndex as number,
    );

    newSectionOrder.forEach(async (section, index) => {
      await api.patch(`/sections/${section._id}`, {
        order: index + 1,
      });
    });

    const activeTopicCopy = {
      ...activeTopic,
      sections: newSectionOrder,
    };

    setActiveTopic(activeTopicCopy as Topic);
  }

  async function handleUseQuiz() {
    if (!selectedQuiz) return;

    try {
      setUseQuizLoading(true);
      await api.patch(`/topics/${activeTopic?._id}`, {
        active_quiz: selectedQuiz._id,
      });

      setActiveTopic({
        ...activeTopic,
        active_quiz: selectedQuiz,
      } as Topic);

      setLastUsedQuizTitle(selectedQuiz.title);
      setIsUseQuizSuccessOpen(true);
    } finally {
      setUseQuizLoading(false);
    }
  }

  async function handleDeleteQuiz() {
    if (!selectedQuiz) return;

    try {
      setDeleteQuizLoading(true);
      await api.delete(`/quizzes/${selectedQuiz._id}`);

      const filteredAvailableQuizzes: Quiz[] =
        availableQuizzes?.filter((q) => q._id !== selectedQuiz._id) || [];

      setAvailableQuizzes(filteredAvailableQuizzes);
      setLastDeletedQuizTitle(selectedQuiz.title);
      setIsDeleteQuizSuccessOpen(true);
      setSelectedQuiz(null);

      if (activeTopic?.active_quiz?._id === selectedQuiz._id) {
        setActiveTopic({
          ...activeTopic,
          active_quiz: undefined,
        } as Topic);
      }
    } finally {
      setDeleteQuizLoading(false);
    }
  }

  if (!availableQuizzes) return <p>Loading...</p>;
  if (!activeTopic) return;

  return (
    <>
      <Loader show={useQuizLoading} text="Updating..." />
      <Loader show={deleteQuizLoading} text="Deleting..." />
      <Loader show={deleteSectionLoading} text="Deleting section..." />

      <section className="w-full h-full flex flex-col">
        <header>
          <div className="w-full flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <h1 className="text-3xl font-medium max-w-sm wrap-break-word">
                {activeTopic.title}
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
                          defaultValue={activeTopic.title}
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
              <AddSectionDialog forDashboard={false}>
                <Button variant="default" size="sm">
                  + Add Section
                </Button>
              </AddSectionDialog>
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
          {activeTopic && activeTopic.sections.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No sections yet. Click "Add Section" to get started.
            </div>
          ) : (
            <DndContext onDragEnd={handleDragEnd}>
              <SortableContext
                items={activeTopic.sections.map((s) => s._id)}
                strategy={verticalListSortingStrategy}
              >
                <div className="space-y-4">
                  {activeTopic.sections.map((section) => (
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

      <Dialog
        open={isUseQuizSuccessOpen}
        onOpenChange={setIsUseQuizSuccessOpen}
      >
        <DialogContent className="sm:max-w-sm rounded">
          <DialogHeader>
            <DialogTitle>Quiz Linked</DialogTitle>
            <DialogDescription>
              You are now using "{lastUsedQuizTitle}" for this topic.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              type="button"
              onClick={() => setIsUseQuizSuccessOpen(false)}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={isDeleteQuizSuccessOpen}
        onOpenChange={setIsDeleteQuizSuccessOpen}
      >
        <DialogContent className="sm:max-w-sm rounded">
          <DialogHeader>
            <DialogTitle>Quiz Deleted</DialogTitle>
            <DialogDescription>
              "{lastDeletedQuizTitle}" has been deleted successfully.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              type="button"
              onClick={() => setIsDeleteQuizSuccessOpen(false)}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={isDeleteSectionSuccessOpen}
        onOpenChange={setIsDeleteSectionSuccessOpen}
      >
        <DialogContent className="sm:max-w-sm rounded">
          <DialogHeader>
            <DialogTitle>Section Deleted</DialogTitle>
            <DialogDescription>
              "{lastDeletedSectionTitle}" has been deleted successfully.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              type="button"
              onClick={() => setIsDeleteSectionSuccessOpen(false)}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Topic;
