import { useEffect, useRef, useState, type FormEvent } from "react";
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

const Handbook = () => {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [activeTopic, setActiveTopic] = useState<Topic | null>(null);
  const [sections, setSections] = useState<Section[]>([]);
  const firstMount = useRef(true);

  useEffect(() => {
    api.get("/topics").then((res) => {
      setTopics(res.data.topics);
    });
  }, [activeTopic, sections]);

  useEffect(() => {
    if (topics.length == 0) return;

    if (firstMount.current) {
      firstMount.current = false;
      return;
    }

    function updateOrder() {
      topics.forEach(async (topic, index) => {
        await api.patch(`/topics/${topic._id}`, {
          order: index + 1,
        });
      });
    }

    updateOrder();
  }, [topics]);

  useEffect(() => {
    if (sections.length == 0) return;

    if (firstMount.current) {
      firstMount.current = false;
      return;
    }

    function updateSectionOrder() {
      sections.forEach(async (section, index) => {
        await api.patch(`/sections/${section._id}`, {
          order: index + 1,
        });
      });
    }

    updateSectionOrder();
  }, [sections]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form as HTMLFormElement);
    const { title } = Object.fromEntries(formData.entries());

    const res = await api.post("/topics", { title });
    setTopics([...topics, res.data.topic]);
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (active.id == over?.id) return;

    const activeIndex = topics.findIndex((s) => s._id == active?.id);
    const overIndex = topics.findIndex((s) => s._id == over?.id);

    setTopics(arrayMove(topics, activeIndex, overIndex));
  }

  async function handleDelete(id: string) {
    await api.delete(`/topics/${id}`);
    const updatedTopics = topics.filter((s) => s._id !== id);
    if (activeTopic?._id === id) {
      setActiveTopic(null);
    }
    setTopics(updatedTopics);
  }

  return (
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
                          className="text font-medium text-foreground w-full h-full  flex  justify-between cursor-pointer gap-2"
                          onClick={() => {
                            setActiveTopic(t);
                            setSections(t.sections);
                          }}
                        >
                          <p className="flex-1 w-20 wrap-break-word text-sm">
                            {t.title}
                          </p>

                          <div className="space-y-1 w-20 h-full flex flex-col">
                            <Button size="sm">
                              <Link
                                to={`/handbook/${t._id}`}
                                className="w-full"
                              >
                                Edit
                              </Link>
                            </Button>
                            <Button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDelete(t._id);
                              }}
                              variant="destructive"
                              size="sm"
                            >
                              Delete
                            </Button>
                          </div>
                        </div>

                        {t.sections.length > 0 && (
                          <>
                            <Separator className="my-4" />

                            <div className="">
                              <ul className="space-y-1">
                                {t.sections.map((s) => (
                                  <li className="text-xs text-gray-400 underline decoration-gray-400 underlne">
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
            <form onSubmit={handleSubmit} className="space-y-4">
              <DialogHeader>
                <DialogTitle>Create Topic</DialogTitle>
                <DialogDescription>
                  Enter the Topic title here. Click save when you&apos;re done.
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
  );
};

export default Handbook;
