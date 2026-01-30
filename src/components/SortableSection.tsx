import { Pencil, Trash2, Eye, SquarePen } from "lucide-react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { FormEvent } from "react";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
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
import { Link } from "react-router";

const SortableSection = ({
  section,
  handleEditSectionName,
  handleDeleteSection,
}: {
  section: Section;
  handleEditSectionName: (e: FormEvent, section_id: string) => void;
  handleDeleteSection: (section_id: string) => void;
}) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: section._id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <>
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        className=" w-full border rounded overflow-hidden shadow bg-card flex gap-4"
      >
        <div className="max-w-3 flex-1 bg-nc-blue" {...listeners}></div>
        <div className="flex-2 max-w-sm p-4 flex items-center ">
          <div className="flex items-center gap-2">
            <p className="w-full text-ellipsis">{section.title}</p>
            <Dialog>
              <DialogTrigger asChild>
                <SquarePen size={24} className="text-nc-blue cursor-pointer" />
              </DialogTrigger>
              <DialogContent className="sm:max-w-sm rounded">
                <form
                  onSubmit={(e) => handleEditSectionName(e, section._id)}
                  className="space-y-4"
                >
                  <DialogHeader>
                    <DialogTitle>Edit Section</DialogTitle>
                    <DialogDescription>
                      Update the Section title here. Click save when you&apos;re
                      done.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4">
                    <div className="grid gap-3">
                      <Label htmlFor="title">Section Title</Label>
                      <Textarea
                        id="title"
                        name="title"
                        defaultValue={section.title}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <DialogClose asChild>
                      <Button type="submit">Save Section</Button>
                    </DialogClose>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>
        <div className="flex gap-4 items-center ml-auto mr-8">
          <div className="w-8 cursor-pointer rounded flex items-center justify-center">
            <Eye size={20} className="text-nc-blue cursor-pointer" />
          </div>
          <div className="w-8 cursor-pointer rounded flex items-center justify-center">
            <Link to={`/handbook/sections/${section._id}`}>
              <Pencil size={20} className="text-green-500 cursor-pointer" />
            </Link>
          </div>
          <div className="w-8 cursor-pointer rounded flex items-center justify-center">
            <Dialog>
              <DialogTrigger asChild>
                <Trash2 size={20} className="text-destructive cursor-pointer" />
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>Delete Section</DialogHeader>
                <DialogDescription>
                  Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                  Placeat repellendus asperiores at assumenda aperiam, odit ad!
                  Ut earum aliquam nobis, dolores iste reiciendis quasi
                  voluptate, vel, eveniet temporibus sunt tempore.
                  {/* TODO fix the content */}
                </DialogDescription>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="outline">Cancel</Button>
                  </DialogClose>
                  <DialogClose asChild>
                    <Button
                      type="submit"
                      variant={"destructive"}
                      onClick={() => handleDeleteSection(section._id)}
                    >
                      Delete Topic
                    </Button>
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
    </>
  );
};

export default SortableSection;
