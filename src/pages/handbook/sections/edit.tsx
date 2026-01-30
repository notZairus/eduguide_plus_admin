import { useEffect, useState } from "react";
import { SimpleEditor } from "../../../components/tiptap-templates/simple/simple-editor";
import { Link, useParams } from "react-router";
import { api } from "../../../lib/api";
import { Button } from "../../../components/ui/button";
import { SquarePen, ChevronLeft } from "lucide-react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
  DialogFooter,
} from "../../../components/ui/dialog";
import { Label } from "../../../components/ui/label";
import { Textarea } from "../../../components/ui/textarea";
import { type FormEvent } from "react";

const SectionEdit = () => {
  const [section, setSection] = useState<Section | null>(null);
  const [content, setContent] = useState(null);
  const { id } = useParams();

  async function handleEditSectionName(e: FormEvent) {
    e.preventDefault();

    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const { title } = Object.fromEntries(formData.entries());

    const res = await api.patch(`/sections/${section?._id}`, { title });
    const updatedSection = res.data.section;

    setSection(updatedSection);
  }

  async function handleSaveContent() {
    await api.patch(`/sections/${section?._id}`, { content });
  }

  useEffect(() => {
    async function getSection() {
      try {
        const res = await api.get(`/sections/${id}`);
        console.log(res.data.section);
        setSection(res.data.section);
        setContent(res.data.section.content ?? null);
      } catch (e) {
        console.log(e);
        throw e;
      }
    }
    getSection();
  }, []);

  if (!section) {
    return <p>Loading....</p>;
  }

  return (
    <div className="bg-gray-50">
      <div className="bg-white shadow w-full min-h-20 flex items-center">
        <div className="flex justify-between w-3xl mx-auto py-4">
          <div className="flex gap-4  items-center">
            <Link to="/handbook">
              <ChevronLeft size={40} className="cursor-pointer" />
            </Link>
            <h1 className="text-3xl font-medium max-w-lg">{section?.title}</h1>
            <div>
              <Dialog>
                <DialogTrigger asChild>
                  <SquarePen
                    size={24}
                    className="text-nc-blue cursor-pointer"
                  />
                </DialogTrigger>
                <DialogContent className="sm:max-w-sm rounded">
                  <form onSubmit={handleEditSectionName} className="space-y-4">
                    <DialogHeader>
                      <DialogTitle>Edit Section</DialogTitle>
                      <DialogDescription>
                        Update the Section title here. Click save when
                        you&apos;re done.
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
          <Button size={"lg"} onClick={handleSaveContent}>
            Save
          </Button>
          {/* TODO save button loader */}
        </div>
      </div>
      <SimpleEditor content={content} setContent={setContent} />
    </div>
  );
};

export default SectionEdit;
