import { useEffect, useState } from "react";
import { SimpleEditor } from "../../../components/tiptap-templates/simple/simple-editor";
import { Link, useParams } from "react-router";
import { api } from "../../../lib/api";
import { Button } from "../../../components/ui/button";
import { SquarePen, ChevronLeft } from "lucide-react";

const SectionEdit = () => {
  const [section, setSection] = useState<Section | null>(null);
  const { id } = useParams();

  useEffect(() => {
    async function getSection() {
      try {
        const res = await api.get(`/sections/${id}`);
        setSection(res.data.section);
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
        <div className="flex justify-between w-3xl mx-auto">
          <div className="flex gap-4  items-center">
            <Link to="/handbook">
              <ChevronLeft size={40} className="cursor-pointer" />
            </Link>
            <h1 className="text-3xl font-medium">{section?.title}</h1>
            <div>
              <SquarePen className="text-nc-blue cursor-pointer" />
              {/* TODO edit section name */}
            </div>
          </div>
          <Button size={"lg"}>Save</Button>
          {/* TODO save content functionality */}
        </div>
      </div>
      <SimpleEditor />
    </div>
  );
};

export default SectionEdit;
