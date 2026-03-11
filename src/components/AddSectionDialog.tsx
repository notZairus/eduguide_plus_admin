import { type FormEvent } from "react";
import { api } from "../lib/api";
import { useHandbookContext } from "../contexts/HandbookContext";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogTrigger,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import TopicSelector from "./TopicSelector";

const AddSectionDialog = ({
  children,
  forDashboard = false,
}: {
  children: React.ReactNode;
  forDashboard: boolean;
}) => {
  const { activeTopic: topic, setActiveTopic } = useHandbookContext();

  async function handleCreateSection(e: FormEvent) {
    e.preventDefault();

    if (!topic) return;

    const form = e.currentTarget as HTMLFormElement;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    try {
      const res = await api.post("/sections", {
        topic_id: topic._id,
        title: data.title,
      });

      const newSection = res.data.section as Section;

      const activeTopicCopy = {
        ...topic,
        sections: [...topic.sections, newSection],
      };

      setActiveTopic(forDashboard ? null : (activeTopicCopy as Topic));
      form.reset();
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent className="sm:max-w-sm rounded">
        <DialogHeader>
          <DialogTitle>Create Section</DialogTitle>
          <DialogDescription>
            Enter the Section title here. Click save when you&apos;re done.
          </DialogDescription>
        </DialogHeader>

        {forDashboard && (
          <div className="space-y-2">
            <Label htmlFor="topic">Topic *</Label>
            <TopicSelector />
          </div>
        )}

        <form onSubmit={handleCreateSection} className="space-y-4">
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
              <Button type="submit" disabled={!topic}>
                Create Section
              </Button>
            </DialogClose>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddSectionDialog;
