import { useState, useRef, type FormEvent } from "react";
import { api } from "../../../lib/api";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Label } from "../../../components/ui/label";
import { Input } from "../../../components/ui/input";
import { Textarea } from "../../../components/ui/textarea";
import { Spinner } from "../../../components/ui/spinner";
import {
  Check,
  Upload,
  X,
  Copy,
  Calendar,
  Clock,
  Settings,
} from "lucide-react";
import Loader from "../../../components/Loader";
import { Separator } from "../../../components/ui/separator";
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
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(handbook!.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

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
      <div className="p-6 space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-muted">
              <Settings className="w-5 h-5 text-muted-foreground" />
            </div>
            <div>
              <h2 className="text-2xl font-semibold tracking-tight">
                Configure Handbook Application
              </h2>
              <p className="text-sm text-muted-foreground">
                Update your Handbook Application's Theme and Branding.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleCopy}
            className="flex items-center gap-2 px-3 py-1.5 rounded-md border text-sm text-muted-foreground hover:bg-accent transition-colors"
          >
            {copied ? (
              <Check className="w-3.5 h-3.5 text-emerald-500" />
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
            <span className="font-mono">{handbook.code}</span>
          </button>
        </div>

        <Separator />

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* General Info */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-base font-medium">
                General Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="flex gap-6 items-start">
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
                <div className="space-y-2">
                  <Label htmlFor="color">Accent Color</Label>
                  <div className="flex items-center gap-2">
                    <div
                      className="w-8 h-8 rounded border shrink-0"
                      style={{ backgroundColor: data.color }}
                    />
                    <Input
                      id="color"
                      type="color"
                      value={data.color}
                      onChange={(e) =>
                        setData({ ...data, color: e.target.value })
                      }
                      className="rounded w-32 h-9 cursor-pointer px-1"
                    />
                  </div>
                </div>
              </div>

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
                  className="rounded resize-none"
                />
              </div>
            </CardContent>
          </Card>

          {/* Media */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-base font-medium">Media</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-8 items-start flex-wrap">
                {/* Thumbnail */}
                <div className="space-y-2">
                  <Label>Thumbnail</Label>
                  <Input
                    accept="image/*"
                    type="file"
                    hidden
                    ref={thumbnailInputRef}
                    onChange={(e) => {
                      const f = e.target.files;
                      if (f) setThumbnail(f[0]);
                    }}
                  />
                  <div
                    className="aspect-10/15 w-48 rounded-lg border-2 border-dashed overflow-hidden relative cursor-pointer hover:border-primary hover:bg-accent/30 transition-colors"
                    onClick={() =>
                      !thumbnail && thumbnailInputRef.current?.click()
                    }
                  >
                    {!thumbnail ? (
                      <div className="flex h-full flex-col items-center justify-center gap-2 text-muted-foreground text-sm">
                        <Upload className="w-6 h-6" />
                        <span>Upload Thumbnail</span>
                        <span className="text-xs">2:3 ratio</span>
                      </div>
                    ) : (
                      <>
                        <img
                          src={
                            typeof thumbnail === "string"
                              ? thumbnail
                              : URL.createObjectURL(thumbnail)
                          }
                          alt="Thumbnail"
                          className="h-full w-full object-cover"
                        />
                        <button
                          type="button"
                          className="absolute top-2 right-2 p-1 rounded-md bg-background/80 hover:bg-background border transition-colors"
                          onClick={(e) => {
                            e.stopPropagation();
                            setThumbnail(null);
                          }}
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {/* Logo */}
                <div className="space-y-2">
                  <Label>Logo</Label>
                  <Input
                    accept="image/*"
                    type="file"
                    hidden
                    ref={logoInputRef}
                    onChange={(e) => {
                      const f = e.target.files;
                      if (f) setLogo(f[0]);
                    }}
                  />
                  <div
                    className="aspect-square w-48 rounded-lg border-2 border-dashed overflow-hidden relative cursor-pointer hover:border-primary hover:bg-accent/30 transition-colors"
                    onClick={() => !logo && logoInputRef.current?.click()}
                  >
                    {!logo ? (
                      <div className="flex h-full flex-col items-center justify-center gap-2 text-muted-foreground text-sm">
                        <Upload className="w-6 h-6" />
                        <span>Upload Logo</span>
                        <span className="text-xs">1:1 ratio</span>
                      </div>
                    ) : (
                      <>
                        <img
                          src={
                            typeof logo === "string"
                              ? logo
                              : URL.createObjectURL(logo)
                          }
                          alt="Logo"
                          className="h-full w-full object-cover"
                        />
                        <button
                          type="button"
                          className="absolute top-2 right-2 p-1 rounded-md bg-background/80 hover:bg-background border transition-colors"
                          onClick={(e) => {
                            e.stopPropagation();
                            setLogo(null);
                          }}
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Metadata */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-base font-medium">Metadata</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="flex items-start gap-3 rounded-lg border p-4">
                  <Calendar className="w-4 h-4 mt-0.5 text-muted-foreground shrink-0" />
                  <div>
                    <p className="text-xs font-medium text-muted-foreground">
                      Created At
                    </p>
                    <p className="mt-0.5 text-sm">
                      {new Date(handbook.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 rounded-lg border p-4">
                  <Clock className="w-4 h-4 mt-0.5 text-muted-foreground shrink-0" />
                  <div>
                    <p className="text-xs font-medium text-muted-foreground">
                      Last Updated
                    </p>
                    <p className="mt-0.5 text-sm">
                      {new Date(handbook.updatedAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Save */}
          <div className="flex justify-end">
            <Button size="lg" className="gap-2 rounded-lg">
              <Check className="size-4" />
              Save Changes
            </Button>
          </div>
        </form>
      </div>
    </>
  );
};

export default HandbookConfigure;
