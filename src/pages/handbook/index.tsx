import { useEffect, useRef, useState, type FormEvent } from "react";
import { Button } from "../../components/ui/button";
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
import SortableSection from "../../components/SortableSection";
import { ScrollArea } from "../../components/ui/scroll-area";
import { api } from "../../lib/api";
import { Separator } from "../../components/ui/separator";
import { Link } from "react-router";

interface Section {
  _id: string;
  title: string;
  order: number;
}

const Handbook = () => {
  const [sections, setSections] = useState<Section[]>([]);
  const firstMount = useRef(true);

  useEffect(() => {
    api.get("sections").then((data) => {
      setSections(data.data.sections);
    });
  }, []);

  useEffect(() => {
    if (sections.length == 0) return;

    if (firstMount.current) {
      firstMount.current = false;
      return;
    }

    function updateOrder() {
      sections.forEach(async (section, index) => {
        await api.patch(`/sections/${section._id}`, {
          order: index + 1,
        });
      });
    }

    updateOrder();
  }, [sections]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form as HTMLFormElement);
    const { title } = Object.fromEntries(formData.entries());

    const res = await api.post("sections", { title });
    setSections([...sections, res.data.section]);
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (active.id == over?.id) return;

    const activeIndex = sections.findIndex((s) => s._id == active?.id);
    const overIndex = sections.findIndex((s) => s._id == over?.id);

    setSections(arrayMove(sections, activeIndex, overIndex));
  }

  async function handleDelete(id: string) {
    await api.delete(`/sections/${id}`);
    const updatedSections = sections.filter((s) => s._id !== id);
    setSections(updatedSections);
  }

  return (
    <div className="w-full h-full flex gap-4">
      {/* section container */}
      <div className="flex-1 h-full flex flex-col gap-4">
        <div className="border rounded p-1 flex flex-col gap-2">
          <ScrollArea className="w-1/4 h-120 border p-1 bg-nc-blue/10">
            <DndContext onDragEnd={handleDragEnd}>
              <SortableContext
                items={sections.map((s) => s._id)}
                strategy={verticalListSortingStrategy}
              >
                <div className="rounded p-4 gap-4 gap-y-8 space-y-4">
                  {/* SECTIONS MAPPP */}
                  {sections.map((s, index) => (
                    <div key={index}>
                      <SortableSection section={s}>
                        <div className="p-4 text font-medium text-foreground w-full h-full rounded shadow bg-white flex">
                          <p className="flex-1 text-sm">{s.title}</p>

                          <Separator orientation="vertical" className="mx-2" />
                          <div className="w-12 space-y-2 h-full">
                            <Button className="w-full text-xs" size={"sm"}>
                              <Link
                                to={`/handbook/${s._id}`}
                                className="w-full"
                              >
                                Edit
                              </Link>
                            </Button>
                            <Button
                              type="button"
                              onClick={() => handleDelete(s._id)}
                              className="w-full text-xs cursor-pointer"
                              size={"sm"}
                              variant={"destructive"}
                            >
                              Delete
                            </Button>
                          </div>
                        </div>
                      </SortableSection>
                    </div>
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          </ScrollArea>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="w-full rounded" size="lg">
              Create New Section
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-sm rounded">
            <form onSubmit={handleSubmit} className="space-y-4">
              <DialogHeader>
                <DialogTitle>Create Section</DialogTitle>
                <DialogDescription>
                  Enter the Section name here. Click save when you&apos;re done.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4">
                <div className="grid gap-3">
                  <Label htmlFor="title">Section Name</Label>
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
  );
};

export default Handbook;
