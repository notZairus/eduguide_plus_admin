import { Pencil, Trash2, Eye } from "lucide-react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { FormEvent } from "react";
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
import { useHandbookContext } from "../contexts/HandbookContext";

const SortableSection = ({
  section,
  handleDeleteSection,
}: {
  section: Section;
  handleEditSectionName: (e: FormEvent, section_id: string) => void;
  handleDeleteSection: (section_id: string) => void;
}) => {
  const { handbook } = useHandbookContext();
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
        <div
          style={{ backgroundColor: handbook?.color }}
          className="max-w-3 flex-1"
          {...listeners}
        ></div>
        <div className="flex-2 max-w-sm p-4 flex items-center ">
          <div className="flex items-center gap-2">
            <p className="w-full text-ellipsis">{section.title}</p>
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
                <DialogHeader>
                  <DialogTitle>Delete Section</DialogTitle>
                  <DialogDescription>
                    Are you sure you want to delete this section? This action
                    cannot be undone.
                  </DialogDescription>
                </DialogHeader>
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
