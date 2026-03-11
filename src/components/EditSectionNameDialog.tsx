import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
  DialogFooter,
} from "./ui/dialog";
import { SquarePen } from "lucide-react";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { type FormEvent } from "react";
import { api } from "../lib/api";
import { useHandbookContext } from "../contexts/HandbookContext";

const EditSectionNameDialog = ({ section }: { section: Section }) => {
  const { topics, setTopics } = useHandbookContext();

  async function handleEditSectionName(e: FormEvent) {
    e.preventDefault();

    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const { title } = Object.fromEntries(formData.entries());

    const res = await api.patch(`/sections/${section?._id}`, { title });
    const updatedSection = res.data.section;

    const topicsCopy = topics.slice();

    const activeTopicIndex = topicsCopy.findIndex((topic) => {
      const sectionIds = topic.sections.map((s) => s._id);
      return sectionIds.includes(section._id);
    });
    const activeTopic = topicsCopy[activeTopicIndex];
    const activeSectionIndex = activeTopic.sections.findIndex(
      (s) => s._id === section._id,
    );
    activeTopic.sections[activeSectionIndex] = updatedSection;

    topicsCopy[activeTopicIndex] = activeTopic;

    setTopics(topicsCopy);
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <SquarePen size={24} className="text-nc-blue cursor-pointer" />
      </DialogTrigger>
      <DialogContent className="sm:max-w-sm rounded">
        <form onSubmit={handleEditSectionName} className="space-y-4">
          <DialogHeader>
            <DialogTitle>Edit Section</DialogTitle>
            <DialogDescription>
              Update the Section title here. Click save when you&apos; Update
              the Section title here. Click save when you&apos;re done.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid gap-3">
              <Label htmlFor="title">Section Title</Label>
              <Textarea id="title" name="title" defaultValue={section.title} />
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
  );
};

export default EditSectionNameDialog;
