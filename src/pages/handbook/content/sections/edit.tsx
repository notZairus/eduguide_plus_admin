import { useEffect, useRef, useState } from "react";
import { SimpleEditor } from "../../../../components/tiptap-templates/simple/simple-editor";
import { Link, useParams } from "react-router";
import { api } from "../../../../lib/api";
import { Button } from "../../../../components/ui/button";
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
} from "../../../../components/ui/dialog";
import { Label } from "../../../../components/ui/label";
import { Textarea } from "../../../../components/ui/textarea";
import { type FormEvent } from "react";
import { Input } from "../../../../components/ui/input";
import { Card } from "../../../../components/ui/card";
import Loader from "../../../../components/Loader";
import { SquarePlay } from "lucide-react";
import { wait } from "../../../../lib/utils";

type Media = {
  name: string;
  file: File;
};

const SectionEdit = () => {
  const [section, setSection] = useState<Section | null>(null);
  const [content, setContent] = useState(null);
  const [medias, setMedias] = useState<Media[]>([]);
  const [storedMedias, setStoredMedias] = useState<StoredMedia[]>([]);
  const { id } = useParams();
  const fileInputRef = useRef(null);

  const [isSaving, setIsSaving] = useState(false);

  async function handleEditSectionName(e: FormEvent) {
    e.preventDefault();

    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const { title } = Object.fromEntries(formData.entries());

    const res = await api.patch(`/sections/${section?._id}`, { title });
    const updatedSection = res.data.section;

    setSection(updatedSection);
  }

  console.log(medias);

  async function handleSaveContent() {
    const formData = new FormData();

    if (!content) return;

    formData.append("content", JSON.stringify(content));
    formData.append("medias", JSON.stringify(storedMedias));
    medias.forEach((m) => {
      formData.append("files", (m as Media).file);
    });

    setIsSaving(true);
    const res = await api.patch(`/sections/${section?._id}`, formData);

    await wait(1);
    setIsSaving(false);

    setMedias([]);
    setSection(res.data.section);
    setStoredMedias(res.data.section.medias);
    setContent(res.data.section.content);
  }

  useEffect(() => {
    async function getSection() {
      try {
        const res = await api.get(`/sections/${id}`);
        setSection(res.data.section);
        setStoredMedias(res.data.section.medias);
        setContent(res.data.section.content ?? null);
      } catch (e) {
        console.log(e);
        throw e;
      }
    }
    getSection();
  }, [id]);

  if (!section) {
    return <p>Loading....</p>;
  }

  return (
    <>
      <Loader show={isSaving} text="Saving..." />
      <div className="bg-gray-50">
        <header className="bg-white shadow w-full min-h-20 flex items-center">
          <div className="flex justify-between w-3xl mx-auto py-4">
            <div className="flex gap-4  items-center">
              <Link to="/handbook/contents">
                <ChevronLeft size={40} className="cursor-pointer" />
              </Link>
              <h1 className="text-3xl font-medium max-w-lg">
                {section?.title}
              </h1>
              <div>
                <Dialog>
                  <DialogTrigger asChild>
                    <SquarePen
                      size={24}
                      className="text-nc-blue cursor-pointer"
                    />
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-sm rounded">
                    <form
                      onSubmit={handleEditSectionName}
                      className="space-y-4"
                    >
                      <DialogHeader>
                        <DialogTitle>Edit Section</DialogTitle>
                        <DialogDescription>
                          Update the Section title here. Click save when
                          you&apos; Update the Section title here. Click save
                          when you&apos;re done.
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
        </header>
        <div className="bg-white border-t border-b">
          <div className="w-xl mx-auto py-4">
            <Input
              ref={fileInputRef}
              hidden
              type="file"
              accept="image/*,video/*"
              onChange={(e) => {
                if (!e.currentTarget.files) return;
                const file = e?.currentTarget?.files[0] as File;

                if ([...storedMedias, ...medias].length < 3) {
                  setMedias([
                    ...medias,
                    {
                      name: file.name,
                      file,
                    },
                  ]);
                }
              }}
            />
            <Button
              className="w-full"
              variant="outline"
              onClick={() => {
                const fileInput = fileInputRef?.current;
                if (!fileInput) return;
                (fileInput as HTMLInputElement).click();
              }}
            >
              Add Media
            </Button>
            <div className="grid grid-cols-3 gap-4 mt-4">
              {storedMedias.map((media) => (
                <Card
                  key={media.url}
                  className="rounded p-1 aspect-square relative"
                >
                  {media.type === "image" ? (
                    <img
                      src={media.url}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-foreground/50 flex items-center justify-center">
                      <SquarePlay className="text-foreground/50" size={64} />
                    </div>
                  )}

                  <Button
                    className="absolute top-1 right-1"
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      const copyMedias = storedMedias.slice();
                      const filtered = copyMedias.filter(
                        (m) => m.url !== media.url,
                      );
                      setStoredMedias(filtered);
                    }}
                  >
                    x
                  </Button>
                </Card>
              ))}

              {medias.map((media, index) => (
                <Card
                  key={index}
                  className="rounded p-1 aspect-square relative"
                >
                  {(media as Media).file.type.startsWith("image") ? (
                    <img
                      src={URL.createObjectURL((media as Media).file)}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-foreground/50 flex items-center justify-center">
                      <SquarePlay className="text-foreground/50" size={64} />
                    </div>
                  )}

                  <Button
                    className="absolute top-1 right-1"
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      const copyMedias = medias.slice();
                      const filtered = copyMedias.filter(
                        (m) => (m as Media).name !== (media as Media).name,
                      );
                      setMedias(filtered);
                    }}
                  >
                    x
                  </Button>
                </Card>
              ))}
            </div>
            {/* TODO  file input*/}
          </div>
        </div>
        <SimpleEditor
          content={content}
          setContent={setContent}
          handleSaveContent={handleSaveContent}
        />
      </div>
    </>
  );
};

export default SectionEdit;
