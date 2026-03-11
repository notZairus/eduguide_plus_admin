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
import { type FormEvent } from "react";
import { api } from "../lib/api";
import { useHandbookContext } from "../contexts/HandbookContext";

const AddTopicDialog = ({ children }: { children: React.ReactNode }) => {
  const { setTopics, topics } = useHandbookContext();

  async function handleCreateTopic(e: FormEvent) {
    e.preventDefault();

    const form = e.currentTarget;
    const formData = new FormData(form as HTMLFormElement);
    const { title } = Object.fromEntries(formData.entries());

    const res = await api.post("/topics", { title });
    setTopics([...topics, res.data.topic]);
  }

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-sm rounded">
        <form onSubmit={handleCreateTopic} className="space-y-4">
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
  );
};

export default AddTopicDialog;
