import React, { useState } from "react";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { Textarea } from "../../../components/ui/textarea";
import { ScrollArea } from "../../../components/ui/scroll-area";

const HandbookManage = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [sections, setSections] = useState<string[]>([]);

  const addSection = () => setSections((s) => [...s, ""]);
  const updateSection = (idx: number, value: string) =>
    setSections((s) => s.map((v, i) => (i === idx ? value : v)));
  const removeSection = (idx: number) =>
    setSections((s) => s.filter((_, i) => i !== idx));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // minimal validation
    if (!name.trim()) return alert("Please provide a category name.");
    // Prepare payload (for now just log)
    const payload = {
      name: name.trim(),
      description: description.trim(),
      sections: sections.map((s) => s.trim()).filter(Boolean),
    };
    console.log("Submitting category:", payload);
    alert("Category submitted (check console).");
    // Reset form (optional)
    setName("");
    setDescription("");
    setSections([]);
  };

  return (
    <div className="w-full h-full gap-4 flex">
      <div className="">
        <ScrollArea className="bg-nc-blue/50 w-64 h-full max-h-150 rounded"></ScrollArea>
      </div>
      <div className="flex-1 p-6 shadow border rounded h-min">
        <h2 className="text-2xl font-semibold mb-4">Add Category</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Category Name</Label>
            <Input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Student Conduct and Discipline"
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief summary of what this category covers"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between mb-2">
              <Label>Sections</Label>
              <Button type="button" variant={"outline"} onClick={addSection}>
                + Add Sections
              </Button>
            </div>

            <div className="space-y-2">
              {sections.length === 0 && (
                <p className="text-sm text-gray-500">No sections added yet.</p>
              )}
              {sections.map((sec, idx) => (
                <div key={idx} className="flex items-center space-x-2">
                  <Input
                    type="text"
                    value={sec}
                    onChange={(e) => updateSection(idx, e.target.value)}
                    placeholder={`Section ${idx + 1} (e.g., Uniform Policy)`}
                    className="flex-1 border rounded px-3 py-2"
                  />
                  <Button
                    type="button"
                    variant={"destructive"}
                    size="sm"
                    onClick={() => removeSection(idx)}
                    className="rounded px-2"
                    aria-label={`Remove section ${idx + 1}`}
                  >
                    Remove
                  </Button>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4">
            <Button type="submit" className="bg-nc-blue rounded" size={"lg"}>
              Save Category
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default HandbookManage;
