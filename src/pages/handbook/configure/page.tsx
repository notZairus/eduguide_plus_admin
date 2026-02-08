import { useState, useRef, type FormEvent } from "react";
import { api } from "../../../lib/api";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Label } from "../../../components/ui/label";
import { Input } from "../../../components/ui/input";
import { Textarea } from "../../../components/ui/textarea";
import { Spinner } from "../../../components/ui/spinner";
import { Check } from "lucide-react";
import { Upload } from "lucide-react";
import Loader from "../../../components/Loader";
import { X } from "lucide-react";
import { useHandbookContext } from "../../../contexts/HandbookContext";

const HandbookConfigure = () => {
  const { handbook, setHandbook } = useHandbookContext();
  const [data, setData] = useState<Partial<Handbook>>({
    title: handbook?.title,
    description: handbook?.description,
    color: handbook?.color,
  });
  const [isUpdating, setIsUpdating] = useState(false);
  const [thumbnail, setThumbnail] = useState<File | null | string>(
    handbook?.thumbnail?.url || null,
  );
  const thumbnailInputRef = useRef<HTMLInputElement>(null);
  const [logo, setLogo] = useState<File | null | string>(
    handbook?.logo?.url || null,
  );
  const logoInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const formData = new FormData();

    formData.append("title", data.title as string);
    formData.append("description", data.description as string);
    formData.append("color", data.color as string);

    if (thumbnail && typeof thumbnail !== "string") {
      formData.append("thumbnail", thumbnail);
    }

    if (logo && typeof logo !== "string") {
      formData.append("logo", logo);
    }

    try {
      setIsUpdating(true);
      const res = await api.put("/handbooks", formData);
      const updatedHandbook = res.data.handbook;
      setHandbook(updatedHandbook);
    } catch (err) {
      console.error("Error updating handbook:", err);
    } finally {
      setIsUpdating(false);
    }
  };

  if (!handbook) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <>
      <Loader show={isUpdating} text="Updating..." />
      <div className="space-y-6 p-6">
        {/* Edit Form Card */}
        <Card className="rounded">
          <CardHeader>
            <CardTitle>Edit Handbook App</CardTitle>
            <CardDescription>
              Update handbook information and manage topics
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Title Field */}
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="flex justify-between items-center gap-12">
                <div className="flex-1 space-y-2">
                  <Label htmlFor="title">Handbook Title</Label>
                  <Input
                    id="title"
                    value={data.title}
                    onChange={(e) =>
                      setData({ ...data, title: e.target.value })
                    }
                    placeholder="Enter handbook title"
                    className="rounded"
                  />
                </div>
                <div className="max-w-50 w-50 space-y-2">
                  <Label htmlFor="color">Handbook Color</Label>
                  <Input
                    id="color"
                    type="color"
                    value={data.color}
                    onChange={(e) =>
                      setData({ ...data, color: e.target.value })
                    }
                    placeholder="Enter handbook color"
                    className="rounded"
                  />
                </div>
              </div>

              {/* Description Field */}
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={data.description}
                  onChange={(e) =>
                    setData({ ...data, description: e.target.value })
                  }
                  placeholder="Enter handbook description"
                  rows={4}
                  className="rounded"
                />
              </div>

              <div className="flex gap-8 items-start">
                <div className="space-y-2">
                  <Label>Thumbnail: </Label>
                  <div className="aspect-10/15 w-64 rounded border overflow-hidden relative">
                    <Input
                      accept="image/*"
                      type="file"
                      hidden
                      ref={thumbnailInputRef}
                      onChange={(e) => {
                        const files = e.target.files;
                        if (!files) return;
                        setThumbnail(files[0] as File);
                      }}
                    />

                    {!thumbnail && (
                      <div
                        className="flex h-full items-center justify-center text-sm"
                        onClick={() => {
                          const fileInput: HTMLInputElement =
                            thumbnailInputRef.current as HTMLInputElement;
                          fileInput.click();
                        }}
                      >
                        <div className="text-center flex flex-col items-center gap-2">
                          <Upload className="mb-2" />
                          <p>Upload Thumbnail</p>
                        </div>
                      </div>
                    )}

                    {thumbnail && (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          className="absolute top-2 right-2"
                          onClick={() => setThumbnail(null)}
                        >
                          <X className="size-4" />
                        </Button>
                        <img
                          src={
                            typeof thumbnail === "string"
                              ? thumbnail
                              : URL.createObjectURL(thumbnail)
                          }
                          alt="Handbook Thumbnail"
                          className="h-full w-full object-cover"
                        />
                      </>
                    )}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Logo: </Label>
                  <div className="aspect-square w-64 rounded border relative">
                    <Input
                      accept="image/*"
                      type="file"
                      hidden
                      ref={logoInputRef}
                      onChange={(e) => {
                        const files = e.target.files;
                        if (!files) return;
                        setLogo(files[0] as File);
                      }}
                    />

                    {!logo && (
                      <div
                        className="flex h-full items-center justify-center text-sm"
                        onClick={() => {
                          const fileInput: HTMLInputElement =
                            logoInputRef.current as HTMLInputElement;
                          fileInput.click();
                        }}
                      >
                        <div className="text-center flex flex-col items-center gap-2">
                          <Upload className="mb-2" />
                          <p>Upload Logo</p>
                        </div>
                      </div>
                    )}

                    {logo && (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          className="absolute top-2 right-2"
                          onClick={() => setLogo(null)}
                        >
                          <X className="size-4" />
                        </Button>
                        <img
                          src={
                            typeof logo === "string"
                              ? logo
                              : URL.createObjectURL(logo)
                          }
                          alt="Logo"
                          className="h-full w-full object-cover"
                        />
                      </>
                    )}
                  </div>
                </div>
              </div>
              {/* Save Button */}
              <div className="flex gap-2 justify-end">
                <Button size={"lg"} className="gap-2 rounded">
                  <Check className="size-4" />
                  Save Handbook
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Metadata Card */}
        <Card className="rounded">
          <CardHeader>
            <CardTitle className="text-lg">Metadata</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="rounded border p-3">
                <p className="text-xs font-medium text-muted-foreground">
                  Created At
                </p>
                <p className="mt-1 text-sm">
                  {new Date(handbook.createdAt).toLocaleString()}
                </p>
              </div>
              <div className="rounded border p-3">
                <p className="text-xs font-medium text-muted-foreground">
                  Last Updated
                </p>
                <p className="mt-1 text-sm">
                  {new Date(handbook.updatedAt).toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default HandbookConfigure;
