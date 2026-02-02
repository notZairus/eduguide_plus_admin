import { useEffect, useState, type FormEvent } from "react";
import Loader from "../../components/Loader";
import { Button } from "../../components/ui/button";
import { Separator } from "../../components/ui/separator";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../components/ui/dialog";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { DndContext, type DragEndEvent } from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import SortableTopic from "../../components/SortableTopic";
import { ScrollArea } from "../../components/ui/scroll-area";
import { api } from "../../lib/api";
import { Link } from "react-router";
import Topic from "../../components/Topic";
import { wait } from "../../lib/utils";

const Handbook = () => {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [activeTopic, setActiveTopic] = useState<Topic | null>(null);
  const [sections, setSections] = useState<Section[]>([]);

  const [isDeleting, setIsDeleting] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    async function fetchTopics() {
      const res = await api.get("/topics");
      setTopics(res.data.topics);
    }

    fetchTopics();
  }, [activeTopic, sections]);

  async function handleCreateTopic(e: FormEvent) {
    e.preventDefault();
    setIsCreating(true);

    const form = e.currentTarget;
    const formData = new FormData(form as HTMLFormElement);
    const { title } = Object.fromEntries(formData.entries());

    const res = await api.post("/topics", { title });
    setTopics([...topics, res.data.topic]);

    await wait(1);
    setIsCreating(false);
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (active.id == over?.id) return;

    const activeIndex = topics.findIndex((s) => s._id == active?.id);
    const overIndex = topics.findIndex((s) => s._id == over?.id);

    const newTopicOrder = arrayMove(topics, activeIndex, overIndex);

    newTopicOrder.forEach(async (topic, index) => {
      await api.patch(`/topics/${topic._id}`, {
        order: index + 1,
      });
    });

    setTopics(newTopicOrder);
  }

  async function handleDelete(id: string) {
    setIsDeleting(true);

    await api.delete(`/topics/${id}`);
    await wait(1);

    setIsDeleting(false);

    const updatedTopics = topics.filter((s) => s._id !== id);
    if (activeTopic?._id === id) {
      setActiveTopic(null);
    }
    setTopics(updatedTopics);
  }

  return (
    <>
      <Loader show={isDeleting} text="Deleting..." />
      <Loader show={isCreating} text="Creating..." />

      <div className="w-full h-full flex items-start relative">
        <div className="w-56 h-full flex flex-col gap-4 fixed">
          <ScrollArea className="h-120 border bg-nc-blue/10 p-2 rounded ">
            <DndContext onDragEnd={handleDragEnd}>
              <SortableContext
                items={topics.map((t) => t._id)}
                strategy={verticalListSortingStrategy}
              >
                <div className="space-y-4">
                  {topics.map((t, index) => (
                    <div key={index}>
                      <SortableTopic topic={t}>
                        <div className="rounded shadow bg-background py-4 px-3">
                          <div
                            className="text font-medium text-foreground w-full h-full  flex items-center justify-between cursor-pointer gap-2"
                            onClick={() => {
                              setActiveTopic(t);
                              setSections(t.sections);
                            }}
                          >
                            <p className="flex-1 w-20 wrap-break-word text-sm">
                              {t.title}
                            </p>

                            <div className="space-y-1 h-full flex flex-col">
                              <Dialog>
                                <DialogTrigger asChild>
                                  <p className="text-xs text-destructive ">
                                    Delete
                                  </p>
                                </DialogTrigger>
                                <DialogContent>
                                  <DialogHeader>Delete Topic</DialogHeader>
                                  <DialogDescription>
                                    Are you sure you want to delete this topic?
                                    This action cannot be undone.
                                  </DialogDescription>
                                  <DialogFooter>
                                    <DialogClose asChild>
                                      <Button variant="outline">Cancel</Button>
                                    </DialogClose>
                                    <DialogClose asChild>
                                      <Button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleDelete(t._id);
                                        }}
                                        type="submit"
                                        variant={"destructive"}
                                      >
                                        Delete Topic
                                      </Button>
                                    </DialogClose>
                                  </DialogFooter>
                                </DialogContent>
                              </Dialog>
                            </div>
                          </div>

                          {t.sections.length > 0 && (
                            <>
                              <Separator className="my-4" />

                              <div className="">
                                <ul className="space-y-1">
                                  {t.sections.map((s) => (
                                    <li
                                      key={s._id}
                                      className="text-xs text-gray-400 underline decoration-gray-400 underlne"
                                    >
                                      <Link to={`/handbook/sections/${s._id}`}>
                                        {s.title}
                                      </Link>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </>
                          )}
                        </div>
                      </SortableTopic>
                    </div>
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          </ScrollArea>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="w-full rounded" size="lg">
                Create New Topic
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-sm rounded">
              <form onSubmit={handleCreateTopic} className="space-y-4">
                <DialogHeader>
                  <DialogTitle>Create Topic</DialogTitle>
                  <DialogDescription>
                    Enter the Topic title here. Click save when you&apos;re
                    done.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4">
                  <div className="grid gap-3">
                    <Label htmlFor="title">Topic Title</Label>
                    <Input id="title" name="title" />
                  </div>
                </div>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="outline">Cancel</Button>
                  </DialogClose>
                  <DialogClose asChild>
                    <Button type="submit">Create Topic</Button>
                  </DialogClose>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
        <div className="w-full h-full ml-60 p-2">
          {activeTopic ? (
            <Topic
              topic={activeTopic as Topic}
              setActiveTopic={setActiveTopic}
              sections={sections}
              setSections={setSections}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-3xl text-foreground/40 font-medium">
              No Topic Selected.
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Handbook;
